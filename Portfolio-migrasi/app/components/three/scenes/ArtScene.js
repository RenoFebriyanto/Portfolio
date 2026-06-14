import * as THREE from 'three';
export const ArtScene = ({ scene, camera }) => {
    camera.position.set(0, 0, 5);
    const light = new THREE.PointLight(0xFF6B35, 2, 10);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x4D8CFF, 0.3));
    // Torus knot core
    const knotGeo = new THREE.TorusKnotGeometry(0.9, 0.28, 128, 16);
    const knotMat = new THREE.MeshStandardMaterial({
        color: 0xFF6B35,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0xFF6B35,
        emissiveIntensity: 0.08,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);
    // Orbital rings
    const rings = [];
    const ringData = [
        { radius: 1.8, tube: 0.015, color: 0x4D8CFF, tiltX: 0.4, tiltZ: 0 },
        { radius: 2.2, tube: 0.01, color: 0xFF6B35, tiltX: 0, tiltZ: 0.6 },
        { radius: 2.6, tube: 0.008, color: 0xffffff, tiltX: 0.9, tiltZ: 0.3 },
    ];
    ringData.forEach(d => {
        const rGeo = new THREE.TorusGeometry(d.radius, d.tube, 8, 80);
        const rMat = new THREE.MeshBasicMaterial({ color: d.color, opacity: 0.5, transparent: true });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = d.tiltX;
        ring.rotation.z = d.tiltZ;
        scene.add(ring);
        rings.push(ring);
    });
    let pointer = { x: 0, y: 0 };
    return {
        update(t) {
            knot.rotation.x = t * 0.2 + pointer.y * 0.3;
            knot.rotation.y = t * 0.35 + pointer.x * 0.3;
            rings[0].rotation.y = t * 0.4;
            rings[1].rotation.z = t * 0.25;
            rings[2].rotation.x = t * 0.3;
        },
        onPointerMove(x, y) {
            pointer = { x, y };
        },
        dispose() {
            knotGeo.dispose();
            knotMat.dispose();
        },
    };
};
