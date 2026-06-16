/* ================================================
   HERO3D.TSX — GLB viewer dengan drag-to-rotate
   Fixes:
   - Single canvas only (guard against StrictMode double-invoke)
   - ResizeObserver instead of window resize (handles zoom)
   - Proper cleanup prevents duplicate renderer
================================================ */
import { useEffect, useRef } from 'react';

const MODEL_PATH = '/models/3dSphere.glb';
const AUTO_SPEED = 0.0025;
const DRAG_SPEED = 0.007;
const DRAG_DAMP  = 0.88;

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Guard: prevent double-init in React StrictMode
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent double mount (React StrictMode runs effects twice in dev)
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Remove any previously injected canvas (safety net)
    container.querySelectorAll('canvas').forEach(c => c.remove());
    container.classList.remove('hero-3d-ready');

    let animFrameId: number | null = null;
    let mesh: any      = null;
    let renderer: any  = null;
    let scene: any     = null;
    let camera: any    = null;
    let ro: ResizeObserver | null = null;
    let isHovered      = false;
    let isDragging     = false;
    let prevMouse      = { x: 0, y: 0 };
    let rotVel         = { x: 0, y: 0 };
    let destroyed      = false;

    async function init() {
      if (destroyed) return;
      const el = containerRef.current;
      if (!el) return;

      const THREE          = await import('three');
      if (destroyed) return;
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (destroyed) return;

      // ── Renderer ──
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace    = THREE.SRGBColorSpace;
      renderer.toneMapping         = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      // Canvas styling: fill container, no position absolute issues
      const canvas = renderer.domElement;
      canvas.style.display  = 'block';
      canvas.style.width    = '100%';
      canvas.style.height   = '100%';
      canvas.style.position = 'absolute';
      canvas.style.inset    = '0';
      el.appendChild(canvas);

      // ── Scene + Camera ──
      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(10, 1, 0.1, 100);
      camera.position.set(0, 0, 15.5);

      // ── Lighting ──
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
      keyLight.position.set(3, 4, 3);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xc8d8ff, 0.6);
      fillLight.position.set(-3, -1, 2);
      scene.add(fillLight);
      const rimLight = new THREE.DirectionalLight(0xffeedd, 0.4);
      rimLight.position.set(0, 0, -4);
      scene.add(rimLight);

      // ── Resize via ResizeObserver (handles browser zoom correctly) ──
      function resize() {
        if (!renderer || !camera || !el) return;
        // Use offsetWidth/Height — accurate even during browser zoom
        const w = el.offsetWidth;
        const h = el.offsetHeight || w;
        renderer.setSize(w, h, false); // false = don't set canvas CSS size (we handle via CSS)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      ro = new ResizeObserver(() => resize());
      ro.observe(el);
      resize();

      // ── Fit model to view ──
      function fitToView(group: any) {
        const box    = new THREE.Box3().setFromObject(group);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale  = 2.2 / Math.max(size.x, size.y, size.z);
        group.scale.setScalar(scale);
        group.position.copy(center.multiplyScalar(-scale));
      }

      // ── Load GLB ──
      new GLTFLoader().load(
        MODEL_PATH,
        (gltf: any) => {
          if (destroyed) return;
          const model = gltf.scene;
          model.traverse((child: any) => {
            if (!child.isMesh) return;
            const mat = child.material as any;
            if (!mat) return;
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.needsUpdate = true;
          });
          fitToView(model);
          scene.add(model);
          mesh = model;
          if (el && !destroyed) el.classList.add('hero-3d-ready');
        },
        undefined,
        (err: any) => console.warn('[Hero3D] GLB load failed:', err)
      );

      // ── RAF loop ──
      const t0 = performance.now();
      function tick() {
        if (destroyed) return;
        animFrameId = requestAnimationFrame(tick);
        const t = (performance.now() - t0) * 0.001;
        if (mesh) {
          if (!isDragging) {
            rotVel.x *= DRAG_DAMP;
            rotVel.y *= DRAG_DAMP;
            if (Math.abs(rotVel.y) < 0.0005) {
              mesh.rotation.y += AUTO_SPEED;
            } else {
              mesh.rotation.y += rotVel.y;
              mesh.rotation.x += rotVel.x;
            }
          }
          const targetY = isHovered ? Math.sin(t * 1.6) * 0.05 : 0;
          mesh.position.y += (targetY - mesh.position.y) * 0.04;
        }
        renderer.render(scene, camera);
      }
      tick();

      // ── Mouse events ──
      const onEnter  = () => { isHovered = true; };
      const onMLeave = () => { isHovered = false; isDragging = false; };
      const onMDown  = (e: MouseEvent) => {
        isDragging = true;
        prevMouse  = { x: e.clientX, y: e.clientY };
        rotVel     = { x: 0, y: 0 };
      };
      const onMMove = (e: MouseEvent) => {
        if (!isDragging || !mesh) return;
        rotVel.y = (e.clientX - prevMouse.x) * DRAG_SPEED;
        rotVel.x = (e.clientY - prevMouse.y) * DRAG_SPEED;
        mesh.rotation.y += rotVel.y;
        mesh.rotation.x += rotVel.x;
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onMUp = () => { isDragging = false; };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onMLeave);
      el.addEventListener('mousedown',  onMDown);
      window.addEventListener('mousemove', onMMove);
      window.addEventListener('mouseup',   onMUp);

      // Touch
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

      el.addEventListener('touchstart', onTStart, { passive: true });
      el.addEventListener('touchmove',  onTMove,  { passive: true });
      el.addEventListener('touchend',   onTEnd);

      // Section lifecycle
      const onLeaveSection = (e: Event) => {
        if ((e as CustomEvent).detail?.id !== 'hero') return;
        if (animFrameId !== null) { cancelAnimationFrame(animFrameId); animFrameId = null; }
      };
      const onEnterSection = (e: Event) => {
        if ((e as CustomEvent).detail?.id !== 'hero') return;
        if (animFrameId !== null || destroyed) return;
        tick();
      };
      window.addEventListener('sectionleave', onLeaveSection);
      window.addEventListener('sectionenter', onEnterSection);

      // Store cleanup handlers on el for use in return
      (el as any).__hero3dCleanup = () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onMLeave);
        el.removeEventListener('mousedown',  onMDown);
        window.removeEventListener('mousemove', onMMove);
        window.removeEventListener('mouseup',   onMUp);
        el.removeEventListener('touchstart', onTStart);
        el.removeEventListener('touchmove',  onTMove);
        el.removeEventListener('touchend',   onTEnd);
        window.removeEventListener('sectionleave', onLeaveSection);
        window.removeEventListener('sectionenter', onEnterSection);
      };
    }

    init();

    return () => {
      destroyed = true;
      initializedRef.current = false;

      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      if (ro) ro.disconnect();

      const el = containerRef.current;
      if (el) {
        (el as any).__hero3dCleanup?.();
        el.classList.remove('hero-3d-ready');
      }

      if (renderer) {
        const canvas = renderer.domElement;
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        renderer.dispose();
        renderer = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-3d-canvas"
      aria-hidden="true"
      style={{ position: 'relative' }}
    />
  );
}