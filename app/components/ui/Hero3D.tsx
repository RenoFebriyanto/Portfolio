import { useEffect, useRef } from 'react';

const MODEL_PATH = '/models/3dSphere.glb';
const AUTO_SPEED = 0.0025;
const DRAG_SPEED = 0.007;
const DRAG_DAMP = 0.88;
const REST_CAMERA_Z = 15.5;
const SCROLL_CAMERA_Z = 9.5;

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    initializedRef.current = true;
    let destroyed = false;
    let frameId = 0;
    let renderer: import('three').WebGLRenderer | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let camera: import('three').PerspectiveCamera | null = null;
    let model: import('three').Object3D | null = null;
    let scrollProgress = 0;
    let scrollStartRotation: { x: number; y: number } | null = null;
    let transitionCameraX = 0;
    let transitionCameraY = 0;
    let transitionStartCameraZ = REST_CAMERA_Z;
    let isFullscreen = false;
    let isHovered = false;
    let isDragging = false;
    let previousPointer = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initialize = async () => {
      const THREE = await import('three');
      if (destroyed) return;
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (destroyed) return;

      const scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(10, 1, 0.1, 100);
      camera.position.set(0, 0, REST_CAMERA_Z);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      canvas = renderer.domElement;
      canvas.style.cssText = 'display:block;width:100%;height:100%;position:absolute;inset:0';
      container.appendChild(canvas);

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

      const resize = () => {
        if (!renderer || !camera || !canvas) return;
        const fullscreen = canvas.classList.contains('hero-scroll-canvas');
        const width = fullscreen ? window.innerWidth : container.clientWidth;
        const height = fullscreen ? window.innerHeight : container.clientHeight || width;
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        if (fullscreen && scrollStartRotation) {
          const centerX = container.getBoundingClientRect().left + container.clientWidth / 2;
          const centerY = container.getBoundingClientRect().top + container.clientHeight / 2;
          const pixelsPerUnit = height /
            (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
          transitionCameraX = (width / 2 - centerX) / pixelsPerUnit;
          transitionCameraY = (centerY - height / 2) / pixelsPerUnit;
          camera.position.x = transitionCameraX * (1 - scrollProgress);
          camera.position.y = transitionCameraY * (1 - scrollProgress);
        }
      };

      const restoreCanvas = () => {
        if (!canvas || !isFullscreen) return;
        canvas.classList.remove('hero-scroll-canvas');
        canvas.style.opacity = '';
        container.appendChild(canvas);
        isFullscreen = false;
        camera?.position.set(0, 0, REST_CAMERA_Z);
        if (camera && model && scrollStartRotation) {
          camera.position.x = 0;
          model.rotation.set(scrollStartRotation.x, scrollStartRotation.y, model.rotation.z);
        }
        scrollStartRotation = null;
        resize();
      };

      const applyScrollProgress = (progress: number) => {
        scrollProgress = Math.max(0, Math.min(1, progress));
        if (!canvas || !camera || !model || reducedMotion) return;

        if (scrollProgress <= 0.001) {
          restoreCanvas();
          return;
        }

        if (!isFullscreen) {
          const rect = canvas.getBoundingClientRect();
          const currentCameraZ = camera.position.z;
          scrollStartRotation = { x: model.rotation.x, y: model.rotation.y };
          transitionStartCameraZ = currentCameraZ *
            (window.innerHeight / Math.max(rect.height, 1));
          const pixelsPerUnit = window.innerHeight /
            (2 * transitionStartCameraZ * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
          transitionCameraX = (window.innerWidth / 2 - (rect.left + rect.width / 2)) / pixelsPerUnit;
          transitionCameraY = ((rect.top + rect.height / 2) - window.innerHeight / 2) / pixelsPerUnit;
          camera.position.z = transitionStartCameraZ;
          canvas.classList.add('hero-scroll-canvas');
          document.body.appendChild(canvas);
          isFullscreen = true;
          resize();
        }

        camera.position.z = transitionStartCameraZ +
          (SCROLL_CAMERA_Z - transitionStartCameraZ) * scrollProgress;
        camera.position.x = transitionCameraX * (1 - scrollProgress);
        camera.position.y = transitionCameraY * (1 - scrollProgress);
        model.rotation.y = scrollStartRotation!.y + Math.PI * 2 * scrollProgress;
        model.rotation.x = scrollStartRotation!.x + 0.24 * scrollProgress;
        canvas.style.opacity = String(Math.max(0, Math.min(1, (1 - scrollProgress) / 0.14)));
      };

      const onHeroScrollProgress = (event: Event) => {
        const progress = (event as CustomEvent<{ progress?: number }>).detail?.progress ?? 0;
        applyScrollProgress(progress);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      window.addEventListener('resize', resize);
      window.addEventListener('heroScrollProgress', onHeroScrollProgress);
      resize();

      const onPointerEnter = () => { isHovered = true; };
      const onPointerLeave = () => { isHovered = false; isDragging = false; };
      const onPointerDown = (event: PointerEvent) => {
        isDragging = true;
        previousPointer = { x: event.clientX, y: event.clientY };
        rotationVelocity = { x: 0, y: 0 };
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!isDragging || !model || scrollProgress > 0) return;
        rotationVelocity.y = (event.clientX - previousPointer.x) * DRAG_SPEED;
        rotationVelocity.x = (event.clientY - previousPointer.y) * DRAG_SPEED;
        model.rotation.y += rotationVelocity.y;
        model.rotation.x += rotationVelocity.x;
        previousPointer = { x: event.clientX, y: event.clientY };
      };
      const onPointerUp = () => { isDragging = false; };

      container.addEventListener('pointerenter', onPointerEnter);
      container.addEventListener('pointerleave', onPointerLeave);
      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      const loader = new GLTFLoader();
      loader.load(
        MODEL_PATH,
        gltf => {
          if (destroyed) return;
          model = gltf.scene;
          model.traverse(child => {
            if (!(child instanceof THREE.Mesh)) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(material => {
              const mappedMaterial = material as THREE.MeshStandardMaterial;
              if (mappedMaterial.map) mappedMaterial.map.colorSpace = THREE.SRGBColorSpace;
              material.needsUpdate = true;
            });
          });

          const bounds = new THREE.Box3().setFromObject(model);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const scale = 1.45 / Math.max(size.x, size.y, size.z);
          model.scale.setScalar(scale);
          model.position.copy(center.multiplyScalar(-scale));
          scene.add(model);
          container.classList.add('hero-3d-ready');
          applyScrollProgress(scrollProgress);
        },
        undefined,
        error => console.warn('[Hero3D] GLB load failed:', error),
      );

      const startTime = performance.now();
      const render = () => {
        if (destroyed || !renderer || !camera) return;
        frameId = requestAnimationFrame(render);
        const time = (performance.now() - startTime) * 0.001;

        if (model) {
          if (scrollProgress <= 0.001 && !reducedMotion) {
            if (!isDragging) {
              rotationVelocity.x *= DRAG_DAMP;
              rotationVelocity.y *= DRAG_DAMP;
              model.rotation.y += Math.abs(rotationVelocity.y) < 0.0005
                ? AUTO_SPEED
                : rotationVelocity.y;
              model.rotation.x += rotationVelocity.x;
            }
            const targetY = isHovered ? Math.sin(time * 1.6) * 0.05 : 0;
            model.position.y += (targetY - model.position.y) * 0.04;
            const targetZ = isHovered ? 13.5 : REST_CAMERA_Z;
            camera.position.z += (targetZ - camera.position.z) * 0.035;
          }
          if (scrollProgress > 0.001 && !reducedMotion) {
            applyScrollProgress(scrollProgress);
          }
        }

        renderer.render(scene, camera);
      };
      render();

      containerCleanup = () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', resize);
        window.removeEventListener('heroScrollProgress', onHeroScrollProgress);
        container.removeEventListener('pointerenter', onPointerEnter);
        container.removeEventListener('pointerleave', onPointerLeave);
        container.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        restoreCanvas();
      };
    };

    let containerCleanup = () => {};
    void initialize();

    return () => {
      destroyed = true;
      initializedRef.current = false;
      cancelAnimationFrame(frameId);
      containerCleanup();
      container.classList.remove('hero-3d-ready');
      if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
      renderer?.dispose();
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
