import * as THREE from 'three';
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave1 = sin(pos.x * 3.0 + uTime * 1.2) * 0.12;
    float wave2 = sin(pos.y * 2.5 + uTime * 0.9) * 0.10;
    float wave3 = sin((pos.x + pos.y) * 2.0 + uTime * 1.5) * 0.06;

    float mouseDist = length(uv - (uMouse * 0.5 + 0.5));
    float mouseWave = sin(mouseDist * 12.0 - uTime * 3.0) * 0.08 * (1.0 - smoothstep(0.0, 0.5, mouseDist));

    pos.z += wave1 + wave2 + wave3 + mouseWave;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2  vUv;
  varying float vElevation;

  vec3 colorA = vec3(0.298, 0.549, 1.0);   /* #4D8CFF */
  vec3 colorB = vec3(1.0,   0.42,  0.208); /* #FF6B35 */

  void main() {
    float t = (vElevation + 0.28) / 0.56;
    vec3 col = mix(colorA, colorB, smoothstep(0.3, 0.7, t));
    col += 0.04 * sin(vUv.x * 20.0 + uTime);

    gl_FragColor = vec4(col, 0.85);
  }
`;
export const ShaderScene = ({ scene, camera }) => {
    camera.position.set(0, -1.5, 3);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const geo = new THREE.PlaneGeometry(4, 4, 64, 64);
    const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
    };
    const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        side: THREE.DoubleSide,
        transparent: true,
        wireframe: false,
    });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -Math.PI * 0.25;
    scene.add(plane);
    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xFF6B35,
        wireframe: true,
        opacity: 0.08,
        transparent: true,
    });
    const wireGeo = new THREE.PlaneGeometry(4, 4, 20, 20);
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.rotation.x = -Math.PI * 0.25;
    scene.add(wire);
    return {
        update(t) {
            uniforms.uTime.value = t;
        },
        onPointerMove(x, y) {
            uniforms.uMouse.value.set(x, y);
        },
        dispose() {
            geo.dispose();
            mat.dispose();
            wireGeo.dispose();
            wireMat.dispose();
        },
    };
};
