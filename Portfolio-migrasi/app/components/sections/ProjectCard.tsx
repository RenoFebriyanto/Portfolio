import { useRef, useCallback, useEffect } from 'react';
import type { Project } from '~/components/sections/Projects';

interface ProjectCardProps {
  project: Project;
  index:   number;
  hidden?: boolean;
}

const MAX_TILT       = 7;
const FADE_DURATION   = 350;
const HOVER_DELAY     = 120;
const AUTO_ROT_SPEED  = 0.004;
const DRAG_SPEED      = 0.007;
const DRAG_DAMP       = 0.88;

/* Module-level cache so a model loaded once isn't re-fetched on re-hover
   or when the user filters the grid and the card remounts. */
const modelCache = new Map<string, any>();

export function ProjectCard({ project, index, hidden = false }: ProjectCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  /* ── 3D Tilt (unchanged — mirrors motion.js initCardTilt) ── */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(700px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateY(-3px)`;
    card.classList.add('tilting');
    const glow = card.querySelector<HTMLElement>('.card-tilt-glow');
    if (glow) {
      const gx = ((e.clientX - rect.left) / rect.width)  * 100;
      const gy = ((e.clientY - rect.top)  / rect.height) * 100;
      glow.style.setProperty('--glow-x', `${gx}%`);
      glow.style.setProperty('--glow-y', `${gy}%`);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
    card.classList.remove('tilting');
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    if (videoRef.current && project.previewVideo && !project.modelPath) {
      videoRef.current.play().catch(() => {});
    }
  }, [project.modelPath, project.previewVideo]);

  /* ── Hover-triggered 3D preview (ported from scripts/data/project3d.js) ──
     Lazily loads the model on first hover, caches it, fades the canvas in
     over the static image, and supports drag-to-rotate + idle auto-rotate.
     Picks GLTFLoader or FBXLoader based on the file extension, so both
     .glb and .fbx project entries work without extra config. */
  useEffect(() => {
    const modelPath = project.modelPath;
    if (!modelPath) return;
    if (window.matchMedia('(hover: none)').matches) return; // skip on touch

    const card    = cardRef.current;
    const preview = previewRef.current;
    const canvas  = canvasRef.current;
    if (!card || !preview || !canvas) return;

    const state = {
      renderer: null as any,
      scene:    null as any,
      camera:   null as any,
      model:    null as any,
      animId:   null as number | null,
      loaded:   false,
      loading:  false,
      hovered:  false,
      showing3d: false,
      rotVel:    { x: 0, y: 0 },
      isDragging: false,
      prevMouse:  { x: 0, y: 0 },
      hoverTimer: null as ReturnType<typeof setTimeout> | null,
      destroyed:  false,
    };

    let resizeObserver: ResizeObserver | null = null;

    function showSpinner(visible: boolean) {
      if (spinnerRef.current) spinnerRef.current.style.opacity = visible ? '1' : '0';
    }

    function ensureRenderer(THREE: any) {
      if (state.renderer) return;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace    = THREE.SRGBColorSpace;
      renderer.toneMapping         = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      const w = preview.clientWidth, h = preview.clientHeight || 1;
      renderer.setSize(w, h);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
      camera.position.set(0, 0, 4.5);

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const key = new THREE.DirectionalLight(0xffffff, 1.8);
      key.position.set(3, 4, 3);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xc8d8ff, 0.5);
      fill.position.set(-3, -1, 2);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffeedd, 0.35);
      rim.position.set(0, 0, -4);
      scene.add(rim);

      state.renderer = renderer;
      state.scene    = scene;
      state.camera   = camera;

      resizeObserver = new ResizeObserver(() => {
        if (!state.renderer || !state.camera) return;
        const w2 = preview.clientWidth, h2 = preview.clientHeight || 1;
        state.renderer.setSize(w2, h2);
        state.camera.aspect = w2 / h2;
        state.camera.updateProjectionMatrix();
      });
      resizeObserver.observe(preview);
    }

    function fitToView(THREE: any, group: any) {
      const box    = new THREE.Box3().setFromObject(group);
      const size   = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale  = 2.0 / Math.max(size.x, size.y, size.z);
      group.scale.setScalar(scale);
      group.position.copy(center.multiplyScalar(-scale));
    }

    async function loadModel() {
      if (state.loading || state.loaded) return;
      state.loading = true;
      showSpinner(true);

      const THREE = await import('three');
      if (state.destroyed) return;
      ensureRenderer(THREE);

      const cached = modelCache.get(modelPath);
      if (cached) {
        onModelReady(THREE, cached);
        return;
      }

      const ext = modelPath.split('.').pop()?.toLowerCase();

      try {
        let object: any;
        if (ext === 'fbx') {
          const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
          object = await new FBXLoader().loadAsync(modelPath);
        } else {
          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          const gltf = await new GLTFLoader().loadAsync(modelPath);
          object = gltf.scene;
        }
        if (state.destroyed) return;

        object.traverse((child: any) => {
          if (!child.isMesh || !child.material) return;
          if (child.material.map) child.material.map.colorSpace = THREE.SRGBColorSpace;
          child.material.needsUpdate = true;
        });

        modelCache.set(modelPath, object);
        onModelReady(THREE, object);
      } catch (err) {
        console.error('[ProjectCard3D] Load error:', modelPath, err);
        showSpinner(false);
        state.loading = false;
      }
    }

    function onModelReady(THREE: any, source: any) {
      state.loading = false;
      state.loaded  = true;
      showSpinner(false);

      const model = source.clone(true);
      fitToView(THREE, model);
      state.scene.add(model);
      state.model = model;

      if (state.hovered) show3D();
    }

    function startLoop() {
      if (state.animId) return;
      function tick() {
        state.animId = requestAnimationFrame(tick);
        if (state.model) {
          state.rotVel.x *= DRAG_DAMP;
          state.rotVel.y *= DRAG_DAMP;
          if (!state.isDragging) {
            if (Math.abs(state.rotVel.y) < 0.0004) {
              state.model.rotation.y += AUTO_ROT_SPEED;
            } else {
              state.model.rotation.y += state.rotVel.y;
              state.model.rotation.x += state.rotVel.x;
            }
          }
        }
        state.renderer?.render(state.scene, state.camera);
      }
      tick();
    }

    function stopLoop() {
      if (state.animId) { cancelAnimationFrame(state.animId); state.animId = null; }
    }

    function show3D() {
      if (state.showing3d) return;
      state.showing3d = true;
      startLoop();

      const imgEl = preview.querySelector<HTMLElement>('.project-preview-img');
      if (imgEl) {
        imgEl.style.transition = `opacity ${FADE_DURATION}ms ease`;
        imgEl.style.opacity    = '0';
      }
      canvas.style.transition    = `opacity ${FADE_DURATION}ms ease`;
      canvas.style.opacity       = '1';
      canvas.style.pointerEvents = 'auto';
      canvas.classList.add('is-visible');
    }

    function hide3D() {
      if (!state.showing3d) return;
      state.showing3d = false;

      canvas.style.transition    = `opacity ${FADE_DURATION}ms ease`;
      canvas.style.opacity       = '0';
      canvas.style.pointerEvents = 'none';
      canvas.classList.remove('is-visible');

      const imgEl = preview.querySelector<HTMLElement>('.project-preview-img');
      if (imgEl) {
        imgEl.style.transition = `opacity ${FADE_DURATION}ms ease`;
        imgEl.style.opacity    = '1';
      }

      setTimeout(() => { if (!state.showing3d) stopLoop(); }, FADE_DURATION + 50);
    }

    function onCardEnter() {
      state.hovered = true;
      state.hoverTimer = setTimeout(() => {
        if (!state.hovered) return;
        if (state.loaded) show3D();
        else loadModel();
      }, HOVER_DELAY);
    }

    function onCardLeave() {
      state.hovered = false;
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      hide3D();
      showSpinner(false);
    }

    function onCanvasMouseDown(e: MouseEvent) {
      state.isDragging = true;
      state.prevMouse  = { x: e.clientX, y: e.clientY };
      state.rotVel     = { x: 0, y: 0 };
      canvas.style.cursor = 'grabbing';
      e.preventDefault();
    }
    function onWindowMouseMove(e: MouseEvent) {
      if (!state.isDragging || !state.model) return;
      const dx = e.clientX - state.prevMouse.x;
      const dy = e.clientY - state.prevMouse.y;
      state.rotVel.y = dx * DRAG_SPEED;
      state.rotVel.x = dy * DRAG_SPEED;
      state.model.rotation.y += state.rotVel.y;
      state.model.rotation.x += state.rotVel.x;
      state.prevMouse = { x: e.clientX, y: e.clientY };
    }
    function onWindowMouseUp() {
      if (state.isDragging) { state.isDragging = false; canvas.style.cursor = 'grab'; }
    }

    card.addEventListener('mouseenter', onCardEnter);
    card.addEventListener('mouseleave', onCardLeave);
    canvas.addEventListener('mousedown', onCanvasMouseDown);
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup',   onWindowMouseUp);

    return () => {
      state.destroyed = true;
      card.removeEventListener('mouseenter', onCardEnter);
      card.removeEventListener('mouseleave', onCardLeave);
      canvas.removeEventListener('mousedown', onCanvasMouseDown);
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup',   onWindowMouseUp);
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      stopLoop();
      resizeObserver?.disconnect();
      state.renderer?.dispose();
    };
  }, [project.modelPath]);

  /* ── Derived values ── */
  const num         = String(project.id).padStart(2, '0');
  const isFeatured  = project.featured === true;
  const accentColor = project.accentColor ?? 'var(--accent-primary)';
  const revealDelay = Math.min(index + 1, 5);
  const hasImage    = !!project.previewImage;
  const hasVideo    = !!project.previewVideo;
  const statusClass = project.status ?? 'completed';

  const hasLink    = !!(project.link ?? project.itchLink ?? project.detailPath);
  const linkHref   = project.link ?? project.itchLink ?? project.detailPath ?? '#';
  const isExternal = hasLink && (linkHref.startsWith('http') || linkHref.startsWith('//'));
  const linkLabel  = project.link
    ? 'View Project'
    : project.itchLink
      ? 'Play on itch.io'
      : project.detailPath
        ? 'Case Study'
        : 'Coming Soon';

  const cardClasses = [
    'project-card', 'reveal', `reveal-delay-${revealDelay}`,
    isFeatured ? 'featured' : '',
    hidden     ? 'hidden'   : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      data-category={project.category}
      data-project-id={project.id}
      data-has-video={String(hasVideo)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      {isFeatured && <span className="project-bg-num" aria-hidden="true">{num}</span>}

      {hasImage || hasVideo ? (
        <div
          ref={previewRef}
          className="project-preview"
          style={{ '--preview-color': accentColor } as React.CSSProperties}
        >
          {hasImage && (
            <img
              className="project-preview-img"
              src={project.previewImage}
              alt={`${project.title} preview`}
              loading="lazy"
              draggable={false}
            />
          )}

          {hasVideo && !project.modelPath && (
            <video
              ref={videoRef}
              className="project-preview-video"
              src={project.previewVideo}
              muted
              playsInline
              loop
              preload="none"
              aria-hidden="true"
            />
          )}

          <div
            className="project-preview-overlay"
            style={{ '--preview-color': accentColor } as React.CSSProperties}
          />
          <div className="project-preview-noise" aria-hidden="true" />

          {project.modelPath && (
            <>
              <canvas ref={canvasRef} className="project3d-canvas" aria-hidden="true" />
              <div ref={spinnerRef} className="project3d-spinner" aria-hidden="true">
                <div className="project3d-spinner-ring" />
              </div>
              <span className="project3d-hint">drag to rotate</span>
            </>
          )}
        </div>
      ) : (
        <div
          className="project-preview project-preview--placeholder"
          style={{ '--preview-color': accentColor } as React.CSSProperties}
        >
          <div className="project-preview-placeholder-inner">
            <span className="project-preview-placeholder-num">{num}</span>
            <span className="project-preview-placeholder-cat">{project.categoryLabel}</span>
          </div>
          <div className="project-preview-noise" aria-hidden="true" />
        </div>
      )}

      <div className="project-card-body">
        <div className="project-card-top">
          <span className="project-num">Project {num}</span>
          <span className={`project-status ${statusClass}`}>{project.statusLabel}</span>
        </div>

        <div className="project-category">{project.categoryLabel}</div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        <div className="project-tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>

        <div className="project-card-footer">
          {hasLink ? (
            isExternal ? (
              <a href={linkHref} className="project-link" target="_blank" rel="noopener noreferrer">
                {linkLabel} <span className="project-link-arrow">&#8594;</span>
              </a>
            ) : (
              <a href={linkHref} className="project-link">
                {linkLabel} <span className="project-link-arrow">&#8594;</span>
              </a>
            )
          ) : (
            <span className="project-link disabled">
              {linkLabel} <span className="project-link-arrow">&#8594;</span>
            </span>
          )}
        </div>
      </div>

      <div className="card-tilt-glow" aria-hidden="true" />
    </div>
  );
}