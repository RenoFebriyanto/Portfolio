import * as THREE from 'three';
export const WebScene = ({ scene, camera }) => {
    camera.position.set(0, 0, 5);
    // Fibonacci sphere particle distribution
    const count = 300;
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = golden * i;
        positions[i * 3] = Math.cos(theta) * radius * 1.8;
        positions[i * 3 + 1] = y * 1.8;
        positions[i * 3 + 2] = Math.sin(theta) * radius * 1.8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
        color: 0x4D8CFF,
        size: 0.04,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    // Connection lines between nearby points
    const linePositions = [];
    const threshold = 0.9;
    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < threshold) {
                linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
        }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
        color: 0xFF6B35,
        opacity: 0.12,
        transparent: true,
    });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));
    let pointer = { x: 0, y: 0 };
    return {
        update(t) {
            points.rotation.y = t * 0.18 + pointer.x * 0.4;
            points.rotation.x = t * 0.08 + pointer.y * 0.2;
        },
        onPointerMove(x, y) {
            pointer = { x, y };
        },
        dispose() {
            geo.dispose();
            mat.dispose();
            lineGeo.dispose();
            lineMat.dispose();
        },
    };
};
