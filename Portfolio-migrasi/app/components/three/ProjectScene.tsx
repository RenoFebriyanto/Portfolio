import * as THREE from 'three';
import type { SceneFactory } from './types';

export const DefaultScene: SceneFactory = ({ scene, camera }) => {
  camera.position.set(0, 0, 4);

  const geo = new THREE.SphereGeometry(1.4, 24, 24);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xFF6B35,
    wireframe: true,
    opacity: 0.4,
    transparent: true,
  });
  const sphere = new THREE.Mesh(geo, mat);
  scene.add(sphere);

  return {
    update(t) {
      sphere.rotation.x = t * 0.2;
      sphere.rotation.y = t * 0.3;
    },
    dispose() {
      geo.dispose();
      mat.dispose();
    },
  };
};