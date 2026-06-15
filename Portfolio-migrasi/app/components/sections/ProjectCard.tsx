import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Project } from '~/data/projects';
import { GameScene } from '~/components/three/scenes/GameScene';
import { ArtScene } from '~/components/three/scenes/ArtScene';
import { ShaderScene } from '~/components/three/scenes/ShaderScene';
import { WebScene } from '~/components/three/scenes/WebScene';
import type { SceneFactory } from '~/components/three/scenes/types';

const SCENE_MAP: Record<string, SceneFactory> = {
  game:   GameScene,
  art:    ArtScene,
  shader: ShaderScene,
  web:    WebScene,
};

// Global GLB cache shared across card instances
const glbCache = new Map<string, unknown>();

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const previewRef    = useRef<HTMLDivElement>(null);
  const rendererRef   = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef      = useRef<THREE.Scene | null>(null);
  const cameraRef     = useRef<THREE.PerspectiveCamera | null>(null);
  const animIdRef     = useRef<number | null>(null);
  const handlersRef   = useRef<{ update: (t: number) => void; onPointerMove?: (x: number, y: number) => void; dispose: () => void } | null>(null);
  const t0Ref         = useRef(performance.now());
  const isHoveredRef  = useRef(false);

  const [isLoaded, setIsLoaded]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show3d, setShow3d]       = useState(false);

  const startLoop = useCallback(() => {
    if (animIdRef.current) return;
    const tick = () => {
      animIdRef.current = requestAnimationFrame(tick);
      const t = (performance.now() - t0Ref.current) / 1000;
      handlersRef.current?.update(t);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    tick();
  }, []);

  const stopLoop = useCallback(() => {
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
      animIdRef.current = null;
    }
  }, []);

  const initRenderer = useCallback(() => {
    const canvas   = canvasRef.current;
    const preview  = previewRef.current;
    if (!canvas || !preview || rendererRef.current) return;

    const w = preview.clientWidth;
    const h = preview.clientHeight || w * (9 / 16);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping      = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setSize(w, h);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);

    rendererRef.current = renderer;
    sceneRef.current    = scene;
    cameraRef.current   = camera;

    // Build scene using the appropriate factory
    const factory = SCENE_MAP[project.sceneType] ?? GameScene;
    handlersRef.current = factory({ scene, camera, renderer });
  }, [project.sceneType]);

  const loadGLB = useCallback(async () => {
    if (!project.modelPath || isLoaded || isLoading) return;
    setIsLoading(true);
    initRenderer();

    try {
      let gltf = glbCache.get(project.modelPath) as { scene: THREE.Group } | undefined;

      if (!gltf) {
        const loader = new GLTFLoader();
        gltf = await new Promise((resolve, reject) =>
          loader.load(project.modelPath!, resolve, undefined, reject)
        ) as { scene: THREE.Group };
        gltf.scene.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (mat?.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.needsUpdate = true;
          }
        });
        glbCache.set(project.modelPath, gltf);
      }

      // Replace default scene with GLB
      if (sceneRef.current) {
        const model = gltf.scene.clone(true);
        const box    = new THREE.Box3().setFromObject(model);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale  = 2.0 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        model.position.copy(center.multiplyScalar(-scale));
        sceneRef.current.clear();
        sceneRef.current.add(new THREE.AmbientLight(0xffffff, 0.7));
        const key = new THREE.DirectionalLight(0xffffff, 1.8);
        key.position.set(3, 4, 3);
        sceneRef.current.add(key);
        sceneRef.current.add(model);

        // Simple auto-rotate update
        handlersRef.current = {
          update: (t) => { model.rotation.y = t * 0.4; },
          dispose: () => {},
        };
      }

      setIsLoaded(true);
      if (isHoveredRef.current) setShow3d(true);
    } catch (err) {
      console.error('[ProjectCard] GLB load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [project.modelPath, isLoaded, isLoading, initRenderer]);

  // Handle show3d changes
  useEffect(() => {
    if (show3d) {
      startLoop();
    } else {
      // Stop loop after fade out
      const timer = setTimeout(stopLoop, 400);
      return () => clearTimeout(timer);
    }
  }, [show3d, startLoop, stopLoop]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;

    if (project.modelPath) {
      if (isLoaded) {
        setShow3d(true);
      } else {
        loadGLB();
        // Init default scene while loading for quick visual
        initRenderer();
        startLoop();
      }
    } else {
      initRenderer();
      startLoop();
      setShow3d(true);
    }
  }, [project.modelPath, isLoaded, loadGLB, initRenderer, startLoop]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    setShow3d(false);
    setIsLoading(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current || !handlersRef.current?.onPointerMove) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    const y = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
    handlersRef.current.onPointerMove(x, -y);
  }, []);

  // Resize observer
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const ro = new ResizeObserver(() => {
      if (!rendererRef.current || !cameraRef.current) return;
      const w = preview.clientWidth;
      const h = preview.clientHeight || w * (9 / 16);
      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    });
    ro.observe(preview);
    return () => ro.disconnect();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopLoop();
      handlersRef.current?.dispose();
      rendererRef.current?.dispose();
    };
  }, [stopLoop]);

  const statusClass = project.status ?? 'completed';
  const statusLabel = project.statusLabel ?? project.status ?? 'Completed';
  const featuredClass = project.featured ? ' project-card--featured' : '';
  const delay = Math.min(index + 1, 5);

  return (
    <article
      className={`project-card${featuredClass} reveal reveal-delay-${delay}`}
      data-category={project.category}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Preview area */}
      <div className="project-card__preview" ref={previewRef}>
        {/* Fallback gradient bg */}
        <div
          className="project-card__preview-bg"
          style={{ background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, ${project.accentColor ?? 'var(--color-accent)'} 15%, transparent), var(--color-bg) 70%)` }}
        />

        {/* Three.js canvas */}
        <canvas
          ref={canvasRef}
          className="project-card__canvas"
          style={{
            opacity: show3d ? 1 : 0,
            transition: 'opacity 350ms ease',
            pointerEvents: show3d ? 'auto' : 'none',
          }}
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="project-card__spinner" aria-hidden>
            <div className="project-card__spinner-ring" />
          </div>
        )}

        {/* Status badge */}
        <span className={`project-card__status project-card__status--${statusClass}`}>
          {statusLabel}
        </span>

        {/* Overlay with links */}
        <div className="project-card__overlay">
          {project.link && (
            <a href={project.link} className="project-card__action" target="_blank" rel="noopener noreferrer">
              View Project ↗
            </a>
          )}
          {project.itchLink && (
            <a href={project.itchLink} className="project-card__action" target="_blank" rel="noopener noreferrer">
              Play on itch.io ↗
            </a>
          )}
          {project.detailPath && (
            <a href={project.detailPath} className="project-card__action">
              Case Study →
            </a>
          )}
        </div>

        {/* Grid noise overlay */}
        <div className="project-card__noise" aria-hidden />
      </div>

      {/* Card body */}
      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__num">Project {String(index + 1).padStart(2, '0')}</span>
          {project.year && <span className="project-card__year">{project.year}</span>}
        </div>
        <p className="project-card__category">{project.categoryLabel}</p>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-card__tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* Tilt glow */}
      <div className="card-tilt-glow" aria-hidden />
    </article>
  );
}
