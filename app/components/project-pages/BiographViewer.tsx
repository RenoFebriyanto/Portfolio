import { useEffect, useRef, useState } from 'react';

const MODEL_PATH  = '/models/Biograph.glb';
const AUTO_SPEED  = 0.0025;
const DRAG_SPEED  = 0.007;
const DRAG_DAMP   = 0.88;

export function BiographViewer() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initializedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    let destroyed = false;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let mesh: any = null;
    let animId: number | null = null;
    let ro: ResizeObserver | null = null;

    let isDragging = false;
    let prevMouse  = { x: 0, y: 0 };
    let rotVel     = { x: 0, y: 0 };

    async function init() {
      const THREE = await import('three');
      if (destroyed) return;
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (destroyed) return;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace    = THREE.SRGBColorSpace;
      renderer.toneMapping         = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0, 6);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xfff3e0, 1.6);
      key.position.set(3, 4, 3);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x88c0ff, 0.4);
      fill.position.set(-3, -1, 2);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xC9912B, 0.5);
      rim.position.set(0, 1, -4);
      scene.add(rim);

      function resize() {
        if (!renderer || !camera) return;
        const w = wrap!.clientWidth;
        const h = wrap!.clientHeight || w;
        renderer.setSize(w, h, false);
        camera.aspect = w / (h || 1);
        camera.updateProjectionMatrix();
      }
      ro = new ResizeObserver(resize);
      ro.observe(wrap);
      resize();

      function frameObject(object: any, fitOffset = 1.4) {
        const box  = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        if (!isFinite(maxSize) || maxSize <= 0) return;

        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        const fovRad = (camera.fov * Math.PI) / 180;
        const fitH = (maxSize / 2) / Math.tan(fovRad / 2);
        const fitW = fitH / camera.aspect;
        const distance = fitOffset * Math.max(fitH, fitW);

        camera.position.set(0, 0, distance);
        camera.near = distance / 100;
        camera.far  = distance * 100;
        camera.updateProjectionMatrix();
      }

      new GLTFLoader().load(
        MODEL_PATH,
        (gltf: any) => {
          if (destroyed) return;
          const model = gltf.scene;
          model.traverse((child: any) => {
            if (!child.isMesh || !child.material) return;
            const mat = child.material;
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.needsUpdate = true;
          });
          frameObject(model);
          scene.add(model);
          mesh = model;
          setLoaded(true);
        },
        undefined,
        (err: any) => {
          console.warn('[BiographViewer] GLB load failed:', err);
          setLoaded(true);
        },
      );

      function tick() {
        if (destroyed) return;
        animId = requestAnimationFrame(tick);
        if (mesh) {
          rotVel.x *= DRAG_DAMP;
          rotVel.y *= DRAG_DAMP;
          if (!isDragging) {
            if (Math.abs(rotVel.y) < 0.0005) {
              mesh.rotation.y += AUTO_SPEED;
            } else {
              mesh.rotation.y += rotVel.y;
              mesh.rotation.x += rotVel.x;
            }
          }
        }
        renderer.render(scene, camera);
      }
      tick();

      const onDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouse  = { x: e.clientX, y: e.clientY };
        rotVel     = { x: 0, y: 0 };
        canvas!.style.cursor = 'grabbing';
      };
      const onMove = (e: MouseEvent) => {
        if (!isDragging || !mesh) return;
        rotVel.y = (e.clientX - prevMouse.x) * DRAG_SPEED;
        rotVel.x = (e.clientY - prevMouse.y) * DRAG_SPEED;
        mesh.rotation.y += rotVel.y;
        mesh.rotation.x += rotVel.x;
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onUp = () => { isDragging = false; if (canvas) canvas.style.cursor = 'grab'; };

      canvas.addEventListener('mousedown', onDown);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);

      let tp = { x: 0, y: 0 };
      const onTStart = (e: TouchEvent) => {
        isDragging = true;
        tp = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        rotVel = { x: 0, y: 0 };
      };
      const onTMove = (e: TouchEvent) => {
        if (!isDragging || !mesh) return;
        rotVel.y = (e.touches[0].clientX - tp.x) * DRAG_SPEED;
        rotVel.x = (e.touches[0].clientY - tp.y) * DRAG_SPEED;
        mesh.rotation.y += rotVel.y;
        mesh.rotation.x += rotVel.x;
        tp = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };
      const onTEnd = () => { isDragging = false; };

      canvas.addEventListener('touchstart', onTStart, { passive: true });
      canvas.addEventListener('touchmove',  onTMove,  { passive: true });
      canvas.addEventListener('touchend',   onTEnd);

      (wrap as any).__bhCleanup = () => {
        canvas!.removeEventListener('mousedown', onDown);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup',   onUp);
        canvas!.removeEventListener('touchstart', onTStart);
        canvas!.removeEventListener('touchmove',  onTMove);
        canvas!.removeEventListener('touchend',   onTEnd);
      };
    }

    init();

    return () => {
      destroyed = true;
      initializedRef.current = false;
      if (animId !== null) cancelAnimationFrame(animId);
      ro?.disconnect();
      (wrap as any).__bhCleanup?.();
      if (renderer) { renderer.dispose(); renderer = null; }
    };
  }, []);

  return (
    <div ref={wrapRef} className="bh-viewer-canvas-wrap">
      <div className="bh-viewer-grid" aria-hidden="true" />
      <canvas ref={canvasRef} aria-hidden="true" style={{ cursor: 'grab' }} />
      <div className="bh-viewer-corner tl" aria-hidden="true" />
      <div className="bh-viewer-corner tr" aria-hidden="true" />
      <div className="bh-viewer-corner bl" aria-hidden="true" />
      <div className="bh-viewer-corner br" aria-hidden="true" />
      <div className={`bh-viewer-loading${loaded ? ' hidden' : ''}`}>
        <div className="bh-viewer-ring" />
        <span className="bh-viewer-loading-text">Loading model…</span>
      </div>
    </div>
  );
}