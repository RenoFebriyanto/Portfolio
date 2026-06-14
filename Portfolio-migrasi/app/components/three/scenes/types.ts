import type * as THREE from 'three';

/**
 * Context passed to every scene factory. The renderer/camera/scene lifecycle
 * (resize, RAF loop, dispose) is owned by <ProjectScene>; each factory only
 * populates the scene and returns update/dispose hooks.
 */
export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export interface SceneHandlers {
  /** Called every frame with elapsed time in seconds. */
  update: (t: number) => void;
  /** Optional: normalized pointer position (-1..1) relative to canvas. */
  onPointerMove?: (x: number, y: number) => void;
  /** Dispose geometries/materials when the scene unmounts or swaps. */
  dispose: () => void;
}

export type SceneFactory = (ctx: SceneContext) => SceneHandlers;