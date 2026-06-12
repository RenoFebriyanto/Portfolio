/* ================================================
   HERO3D.JS — Render GLB dengan texture/material asli
   <script type="module" src="scripts/hero3d.js">
================================================ */

import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('hero-3d-canvas');
if (!container) {
    console.warn('[Hero3D] #hero-3d-canvas tidak ditemukan');
} else {
    init();
}

function init() {
    const MODEL_PATH = 'Assets/project/3d/3dSphere.glb';

    /* ---- State ---- */
    let mesh, animFrameId;
    let isHovered  = false;
    let isDragging = false;
    let prevMouse  = { x: 0, y: 0 };
    let rotVel     = { x: 0, y: 0 };

    const DRAG_DAMP  = 0.88;
    const DRAG_SPEED = 0.007;
    const AUTO_SPEED = 0.0025;

    /* ---- Renderer ---- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping      = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    /* ---- Scene + Camera ---- */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    /* ---- Lighting — agar material PBR terlihat baik ---- */
    // Ambient: fill seluruh permukaan
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Key light: dari kanan atas
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Fill light: dari kiri bawah, lebih redup
    const fillLight = new THREE.DirectionalLight(0xc8d8ff, 0.6);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    // Rim light: dari belakang untuk edge definition
    const rimLight = new THREE.DirectionalLight(0xffeedd, 0.4);
    rimLight.position.set(0, 0, -4);
    scene.add(rimLight);

    /* ---- Resize ---- */
    function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight || w;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ---- Center + scale ---- */
    function fitToView(group) {
        const box    = new THREE.Box3().setFromObject(group);
        const size   = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale  = 2.2 / Math.max(size.x, size.y, size.z);
        group.scale.setScalar(scale);
        group.position.copy(center.multiplyScalar(-scale));
    }

    /* ---- Load GLB ---- */
    console.log('[Hero3D] Loading:', MODEL_PATH);
    new GLTFLoader().load(
        MODEL_PATH,
        (gltf) => {
            console.log('[Hero3D] GLB OK');

            const model = gltf.scene;

            // Pastikan semua material menggunakan color space yang benar
            model.traverse((child) => {
                if (!child.isMesh) return;
                const mat = child.material;
                if (!mat) return;

                // Aktifkan shadow & depth
                child.castShadow    = true;
                child.receiveShadow = true;

                // Fix color space untuk texture jika ada
                if (mat.map)              mat.map.colorSpace              = THREE.SRGBColorSpace;
                if (mat.emissiveMap)      mat.emissiveMap.colorSpace      = THREE.SRGBColorSpace;
                if (mat.envMap)           mat.envMap.colorSpace           = THREE.SRGBColorSpace;

                mat.needsUpdate = true;
            });

            fitToView(model);
            scene.add(model);
            mesh = model;

            container.classList.add('hero-3d-ready');
        },
        (xhr) => {
            if (xhr.total) console.log('[Hero3D]', Math.round(xhr.loaded / xhr.total * 100) + '%');
        },
        (err) => {
            console.error('[Hero3D] Load error:', err);
        }
    );

    /* ---- RAF Loop ---- */
    const t0 = performance.now();
    function tick() {
        animFrameId = requestAnimationFrame(tick);
        const t = (performance.now() - t0) * 0.001;

        if (mesh) {
            if (!isDragging) {
                rotVel.x *= DRAG_DAMP;
                rotVel.y *= DRAG_DAMP;
                if (Math.abs(rotVel.y) < 0.0005) {
                    mesh.rotation.y += AUTO_SPEED;
                } else {
                    mesh.rotation.y += rotVel.y;
                    mesh.rotation.x += rotVel.x;
                }
            }

            /* Hover: gentle float */
            const targetY = isHovered ? Math.sin(t * 1.6) * 0.05 : 0;
            mesh.position.y += (targetY - mesh.position.y) * 0.04;
        }

        renderer.render(scene, camera);
    }
    tick();

    /* ---- Input ---- */
    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mouseleave', () => { isHovered = false; isDragging = false; });

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouse  = { x: e.clientX, y: e.clientY };
        rotVel     = { x: 0, y: 0 };
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging || !mesh) return;
        rotVel.y = (e.clientX - prevMouse.x) * DRAG_SPEED;
        rotVel.x = (e.clientY - prevMouse.y) * DRAG_SPEED;
        mesh.rotation.y += rotVel.y;
        mesh.rotation.x += rotVel.x;
        prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    let tp = { x: 0, y: 0 };
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        tp = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        rotVel = { x: 0, y: 0 };
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
        if (!isDragging || !mesh) return;
        rotVel.y = (e.touches[0].clientX - tp.x) * DRAG_SPEED;
        rotVel.x = (e.touches[0].clientY - tp.y) * DRAG_SPEED;
        mesh.rotation.y += rotVel.y;
        mesh.rotation.x += rotVel.x;
        tp = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    container.addEventListener('touchend', () => { isDragging = false; });

    /* ---- Section lifecycle ---- */
    window.addEventListener('sectionleave', (e) => {
        if (e.detail?.id === 'hero' && animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    });
    window.addEventListener('sectionenter', (e) => {
        if (e.detail?.id === 'hero' && !animFrameId) tick();
    });
}