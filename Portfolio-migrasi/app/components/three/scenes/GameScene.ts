import * as THREE from 'three';
import type { SceneFactory } from './types';

export const GameScene: SceneFactory = ({ scene, camera }) => {
  camera.position.set(0, 0, 4);

  // Core icosahedron
  const geo  = new THREE.IcosahedronGeometry(1, 1);
  const mat  = new THREE.MeshStandardMaterial({
    color: 0xFF6B35,
    wireframe: true,
    emissive: 0xFF6B35,
    emissiveIntensity: 0.15,
  });
  const core = new THREE.Mesh(geo, mat);
  scene.add(core);

  // Ambient + directional light
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const dir = new THREE.DirectionalLight(0xFF6B35, 1.2);
  dir.position.set(2, 3, 2);
  scene.add(dir);

  // Orbiting cubes
  const cubeCount = 6;
  const cubes: THREE.Mesh[] = [];
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x4D8CFF,
    emissive: 0x4D8CFF,
    emissiveIntensity: 0.2,
  });

  for (let i = 0; i < cubeCount; i++) {
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), cubeMat);
    const angle = (i / cubeCount) * Math.PI * 2;
    cube.userData.angle  = angle;
    cube.userData.radius = 1.8 + (i % 2) * 0.4;
    cube.userData.speed  = 0.3 + i * 0.05;
    scene.add(cube);
    cubes.push(cube);
  }

  // Grid floor
  const grid = new THREE.GridHelper(6, 10, 0xFF6B35, 0x1a1a2e);
  grid.position.y = -1.8;
  grid.material = new THREE.LineBasicMaterial({ color: 0x1a1a2e, opacity: 0.5, transparent: true });
  scene.add(grid);

  return {
    update(t) {
      core.rotation.x = t * 0.3;
      core.rotation.y = t * 0.5;

      cubes.forEach(cube => {
        const angle = cube.userData.angle + t * cube.userData.speed;
        cube.position.x = Math.cos(angle) * cube.userData.radius;
        cube.position.z = Math.sin(angle) * cube.userData.radius;
        cube.position.y = Math.sin(t + cube.userData.angle) * 0.3;
        cube.rotation.x = t;
        cube.rotation.y = t * 0.7;
      });
    },
    dispose() {
      geo.dispose();
      mat.dispose();
      cubeMat.dispose();
    },
  };
};