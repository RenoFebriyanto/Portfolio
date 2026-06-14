import type { Scene, Camera } from "three";

export interface SceneContext {
  scene: Scene;
  camera: Camera;
}

export type AnimateFn = (t: number) => void;

export type SceneFactory = (context: SceneContext) => {
  update: (t: number) => void;
  dispose?: () => void;
};