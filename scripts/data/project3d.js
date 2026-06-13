/* ================================================
   PROJECT3D.JS — Hover-triggered GLB preview per card
   
   Flow:
   - Default: image preview tampil normal
   - Hover in: spinner muncul → GLB load (cached setelah pertama)
   - GLB ready + masih hover: image fade out → canvas 3D fade in
   - Hover out: canvas fade out → image fade in → renderer pause
   - Hover in lagi: langsung tampil (cached), no reload
   
   Arsitektur: satu renderer per card, di-init lazy saat hover pertama.
   Renderer di-pause saat tidak di-hover untuk hemat GPU.
================================================ */

import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

(function initProject3D() {

    /* Skip di touch device — drag rotate tidak natural di mobile */
    if (window.matchMedia('(hover: none)').matches) return;

    /* ---- Config ---- */
    const FADE_DURATION  = 350;   // ms fade antara image ↔ 3D
    const HOVER_DELAY    = 120;   // ms debounce sebelum mulai load (hindari flicker saat cursor lewat)
    const AUTO_ROT_SPEED = 0.004;
    const DRAG_SPEED     = 0.007;
    const DRAG_DAMP      = 0.88;

    /* ---- GLB cache: slug → gltf object ---- */
    const glbCache = new Map();

    /* ---- Active card tracker (hanya 1 aktif render loop) ---- */
    let activeCard = null;

    /* ================================================
       INIT PER CARD
    ================================================ */
    function setupCard(card) {
        const glbPath = card.dataset.glb;
        if (!glbPath) return; /* card tanpa GLB — skip */

        const preview  = card.querySelector('.project-preview');
        const imgEl    = card.querySelector('.project-preview-img');
        const spinner  = card.querySelector('.project3d-spinner');
        const canvas   = card.querySelector('.project3d-canvas');
        if (!preview || !canvas) return;

        /* ---- Per-card state ---- */
        const state = {
            renderer:    null,
            scene:       null,
            camera:      null,
            model:       null,
            animId:      null,
            loaded:      false,
            loading:     false,
            hovered:     false,
            showing3d:   false,
            rotVel:      { x: 0, y: 0 },
            isDragging:  false,
            prevMouse:   { x: 0, y: 0 },
            hoverTimer:  null,
        };

        /* ---- Renderer init (lazy) ---- */
        function initRenderer() {
            const renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setClearColor(0x000000, 0);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping      = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;

            const w = preview.clientWidth;
            const h = preview.clientHeight;
            renderer.setSize(w, h);

            const scene  = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
            camera.position.set(0, 0, 4.5);

            /* Lighting */
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
        }

        /* ---- Fit model ke view ---- */
        function fitToView(group) {
            const box    = new THREE.Box3().setFromObject(group);
            const size   = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale  = 2.0 / Math.max(size.x, size.y, size.z);
            group.scale.setScalar(scale);
            group.position.copy(center.multiplyScalar(-scale));
        }

        /* ---- Load GLB (dengan cache) ---- */
        function loadGLB() {
            if (state.loading || state.loaded) return;
            state.loading = true;
            showSpinner(true);

            /* Cek cache dulu */
            if (glbCache.has(glbPath)) {
                const cached = glbCache.get(glbPath);
                onModelReady(cached);
                return;
            }

            /* Lazy init renderer saat pertama kali load */
            if (!state.renderer) initRenderer();

            /* Load via GLTFLoader */
            const loader = new GLTFLoader();

            loader.load(
                glbPath,
                (gltf) => {
                    /* Fix texture color space */
                    gltf.scene.traverse((child) => {
                        if (!child.isMesh || !child.material) return;
                        if (child.material.map)
                            child.material.map.colorSpace = THREE.SRGBColorSpace;
                        child.material.needsUpdate = true;
                    });

                    glbCache.set(glbPath, gltf);
                    onModelReady(gltf);
                },
                null,
                (err) => {
                    console.error('[Project3D] GLB load error:', glbPath, err);
                    showSpinner(false);
                    state.loading = false;
                }
            );
        }

        /* ---- Model ready: add to scene ---- */
        function onModelReady(gltf) {
            state.loading = false;
            state.loaded  = true;
            showSpinner(false);

            if (!state.renderer) initRenderer();

            /* Clone scene agar tiap card punya instance sendiri */
            const model = gltf.scene.clone(true);
            fitToView(model);
            state.scene.add(model);
            state.model = model;

            /* Kalau user masih hover → langsung tampil 3D */
            if (state.hovered) {
                show3D();
            }
        }

        /* ---- RAF Loop ---- */
        function startLoop() {
            if (state.animId) return;

            function tick() {
                state.animId = requestAnimationFrame(tick);

                if (state.model) {
                    /* Dampen velocity */
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
            if (state.animId) {
                cancelAnimationFrame(state.animId);
                state.animId = null;
            }
        }

        /* ---- Show / hide 3D canvas ---- */
        function show3D() {
            if (state.showing3d) return;
            state.showing3d = true;

            /* Mulai render loop */
            startLoop();

            /* Fade: image out, canvas in */
            if (imgEl) {
                imgEl.style.transition = `opacity ${FADE_DURATION}ms ease`;
                imgEl.style.opacity    = '0';
            }
            canvas.style.transition = `opacity ${FADE_DURATION}ms ease`;
            canvas.style.opacity    = '1';
            canvas.style.pointerEvents = 'auto';

            activeCard = card;
        }

        function hide3D() {
            if (!state.showing3d) return;
            state.showing3d = false;

            /* Fade: canvas out, image in */
            canvas.style.transition = `opacity ${FADE_DURATION}ms ease`;
            canvas.style.opacity    = '0';
            canvas.style.pointerEvents = 'none';

            if (imgEl) {
                imgEl.style.transition = `opacity ${FADE_DURATION}ms ease`;
                imgEl.style.opacity    = '1';
            }

            /* Pause render setelah fade selesai */
            setTimeout(() => {
                if (!state.showing3d) stopLoop();
            }, FADE_DURATION + 50);

            if (activeCard === card) activeCard = null;
        }

        /* ---- Spinner helper ---- */
        function showSpinner(visible) {
            if (!spinner) return;
            spinner.style.opacity = visible ? '1' : '0';
        }

        /* ---- Drag to rotate ---- */
        canvas.addEventListener('mousedown', (e) => {
            state.isDragging = true;
            state.prevMouse  = { x: e.clientX, y: e.clientY };
            state.rotVel     = { x: 0, y: 0 };
            canvas.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!state.isDragging || !state.model) return;
            const dx = e.clientX - state.prevMouse.x;
            const dy = e.clientY - state.prevMouse.y;
            state.rotVel.y = dx * DRAG_SPEED;
            state.rotVel.x = dy * DRAG_SPEED;
            state.model.rotation.y += state.rotVel.y;
            state.model.rotation.x += state.rotVel.x;
            state.prevMouse = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => {
            if (state.isDragging) {
                state.isDragging = false;
                canvas.style.cursor = 'grab';
            }
        });

        /* ---- Hover events ---- */
        card.addEventListener('mouseenter', () => {
            state.hovered = true;

            /* Debounce: hindari load kalau cursor cuma lewat */
            state.hoverTimer = setTimeout(() => {
                if (!state.hovered) return;

                if (state.loaded) {
                    show3D();
                } else {
                    loadGLB();
                }
            }, HOVER_DELAY);
        });

        card.addEventListener('mouseleave', () => {
            state.hovered = false;
            clearTimeout(state.hoverTimer);

            hide3D();
            showSpinner(false);
        });

        /* ---- Resize handler ---- */
        const resizeObserver = new ResizeObserver(() => {
            if (!state.renderer || !state.camera) return;
            const w = preview.clientWidth;
            const h = preview.clientHeight;
            state.renderer.setSize(w, h);
            state.camera.aspect = w / h;
            state.camera.updateProjectionMatrix();
        });
        resizeObserver.observe(preview);
    }

    /* ================================================
       BIND ALL CARDS
    ================================================ */
    function bindCards() {
        document.querySelectorAll('.project-card[data-glb]').forEach(setupCard);
    }

    /* Bind setelah projects-render.js selesai inject cards */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindCards);
    } else {
        bindCards();
    }

    /* ================================================
       SECTION LIFECYCLE — pause semua saat leave projects
    ================================================ */
    window.addEventListener('sectionleave', (e) => {
        if (e.detail?.id !== 'projects') return;
        /* Stop semua active loop */
        document.querySelectorAll('.project3d-canvas').forEach(canvas => {
            canvas.style.opacity    = '0';
            canvas.style.pointerEvents = 'none';
        });
        document.querySelectorAll('.project-preview-img').forEach(img => {
            img.style.opacity = '1';
        });
        document.querySelectorAll('.project3d-spinner').forEach(s => {
            s.style.opacity = '0';
        });
    });

})();