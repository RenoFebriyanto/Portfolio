/* ================================================
   HERO3D.TSX — GLB viewer dengan drag-to-rotate
   Port dari vanilla scripts/hero3d.js
   Path: /models/3dSphere.glb (relative to /public)
================================================ */
import { useEffect, useRef } from 'react';

const MODEL_PATH = '/models/3dSphere.glb';
const AUTO_SPEED = 0.0025;
const DRAG_SPEED = 0.007;
const DRAG_DAMP  = 0.88;

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return; // ← single null guard covers all uses below

    let animFrameId: number | null = null;
    let mesh: any     = null;
    let isHovered     = false;
    let isDragging    = false;
    let prevMouse     = { x: 0, y: 0 };
    let rotVel        = { x: 0, y: 0 };
    let renderer: any = null;
    let scene: any    = null;
    let camera: any   = null;

    async function init() {
      const THREE          = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

      // ── Renderer ──
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace   = (THREE as any).SRGBColorSpace;
      renderer.toneMapping        = (THREE as any).ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // ── Scene + Camera ──
      scene  = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 4.5);

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

      // ── Resize ──
      function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight || w;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      // ── Fit model ──
      function fitToView(group: THREE.Group) {
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
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            const mesh3d = child as THREE.Mesh;
            if (!mesh3d.isMesh) return;
            const mat = mesh3d.material as THREE.MeshStandardMaterial;
            if (!mat) return;
            if (mat.map) mat.map.colorSpace = (THREE as any).SRGBColorSpace;
            mat.needsUpdate = true;
          });
          fitToView(model);
          scene.add(model);
          mesh = model;
          container.classList.add('hero-3d-ready');
        },
        undefined,
        (err) => console.warn('[Hero3D] GLB load failed:', err)
      );

      // ── RAF loop ──
      const t0 = performance.now();
      function tick() {
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
    }

    init();

    // ── Mouse events ──
    const onEnter  = () => { isHovered  = true; };
    const onMLeave = () => { isHovered  = false; isDragging = false; };
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

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onMLeave);
    container.addEventListener('mousedown',  onMDown);
    window.addEventListener('mousemove',     onMMove);
    window.addEventListener('mouseup',       onMUp);

    // ── Touch events ──
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

    container.addEventListener('touchstart', onTStart, { passive: true });
    container.addEventListener('touchmove',  onTMove,  { passive: true });
    container.addEventListener('touchend',   onTEnd);

    // ── Section lifecycle ──
    const onLeaveSection = (e: Event) => {
      if ((e as CustomEvent).detail?.id !== 'hero') return;
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    };
    const onEnterSection = (e: Event) => {
      if ((e as CustomEvent).detail?.id !== 'hero') return;
      if (animFrameId !== null || !renderer || !scene || !camera) return;
      function resumeTick() {
        animFrameId = requestAnimationFrame(resumeTick);
        if (mesh) mesh.rotation.y += AUTO_SPEED;
        renderer.render(scene, camera);
      }
      resumeTick();
    };

    window.addEventListener('sectionleave', onLeaveSection);
    window.addEventListener('sectionenter', onEnterSection);

    // ── Cleanup ──
    return () => {
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onMLeave);
      container.removeEventListener('mousedown',  onMDown);
      window.removeEventListener('mousemove',     onMMove);
      window.removeEventListener('mouseup',       onMUp);
      container.removeEventListener('touchstart', onTStart);
      container.removeEventListener('touchmove',  onTMove);
      container.removeEventListener('touchend',   onTEnd);
      window.removeEventListener('sectionleave',  onLeaveSection);
      window.removeEventListener('sectionenter',  onEnterSection);
      if (renderer) {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, []);

  return <div ref={containerRef} id="hero-3d-canvas" aria-hidden="true" />;
}