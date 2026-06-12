/* ================================================
   HERO3D.JS — Interactive 3D sphere in hero section
   
   Features:
     - GLB model loaded via Three.js GLTFLoader
     - Custom GLSL wireframe shader (glow + futuristic)
     - Drag to rotate (mouse & touch)
     - Auto-rotate idle (pauses while dragging)
     - Hover: glow intensity boost + subtle distortion
   
   Dependencies (CDN, loaded in index.html):
     - three.module.js  (r160)
     - GLTFLoader
   
   No global Three.js needed — uses ES module import.
================================================ */

(function initHero3D() {

    const container = document.getElementById('hero-3d-canvas');
    if (!container) return;

    /* ---- Lazy-load Three.js from CDN as ES module ---- */
    const THREEJS_VERSION = 'r160';
    const CDN = `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`;
    const GLTF_CDN = `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js`;
    const MODEL_PATH = 'Assets/project/3d/3dSphere.glb';

    /* ---- State ---- */
    let renderer, scene, camera, mesh, animFrameId;
    let isHovered  = false;
    let isDragging = false;
    let autoRotate = true;

    /* Drag state */
    let prevMouse = { x: 0, y: 0 };
    let rotVel    = { x: 0, y: 0 };   // angular velocity (inertia)
    const DRAG_DAMP  = 0.88;           // inertia decay
    const DRAG_SPEED = 0.008;
    const AUTO_SPEED = 0.003;

    /* ---- GLSL Shaders ---- */
    const vertexShader = /* glsl */`
        uniform float uTime;
        uniform float uHover;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal   = normalize(normalMatrix * normal);
            vPosition = position;

            /* Subtle vertex noise on hover */
            vec3 pos = position;
            float wave = sin(pos.y * 4.0 + uTime * 2.0) * 0.008 * uHover;
            pos += normal * wave;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = /* glsl */`
        uniform float uTime;
        uniform float uHover;
        uniform vec3  uAccent;
        uniform vec3  uAlt;
        varying vec3  vNormal;
        varying vec3  vPosition;

        void main() {
            /* Fresnel — edge glow */
            vec3  viewDir = normalize(cameraPosition - vPosition);
            float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
            fresnel = pow(fresnel, 2.2);

            /* Color mix: accent orange ↔ alt blue based on position */
            float t    = vPosition.y * 0.5 + 0.5;
            vec3  col  = mix(uAlt, uAccent, t);

            /* Breathing pulse */
            float pulse = 0.85 + 0.15 * sin(uTime * 1.4);

            /* Hover brightness */
            float bright = 1.0 + uHover * 0.55;

            /* Final: wireframe lines are handled by WireframeGeometry,
               this shader handles the color + glow of each line segment */
            float alpha  = (0.45 + fresnel * 0.55) * pulse * bright;

            gl_FragColor = vec4(col * bright, alpha);
        }
    `;

    /* ---- Boot ---- */
    import(CDN).then(THREE => {
        import(GLTF_CDN).then(({ GLTFLoader }) => {
            setup(THREE, GLTFLoader);
        });
    }).catch(err => {
        console.warn('[Hero3D] Failed to load Three.js:', err);
    });


    function setup(THREE, GLTFLoader) {

        /* --- Renderer --- */
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha:     true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        resize(THREE);
        container.appendChild(renderer.domElement);

        /* --- Scene + Camera --- */
        scene  = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 4.2);

        /* --- Uniforms --- */
        const uniforms = {
            uTime:   { value: 0 },
            uHover:  { value: 0 },
            uAccent: { value: new THREE.Color('#FF6B35') },
            uAlt:    { value: new THREE.Color('#4D8CFF') },
        };

        /* --- Load GLB --- */
        const loader = new GLTFLoader();
        loader.load(
            MODEL_PATH,
            (gltf) => {
                const root = gltf.scene;

                /* Collect all meshes and build wireframe */
                const wireGroup = new THREE.Group();

                root.traverse((child) => {
                    if (!child.isMesh) return;

                    /* Build wireframe from each mesh geometry */
                    const wGeo = new THREE.WireframeGeometry(child.geometry);
                    const mat  = new THREE.ShaderMaterial({
                        vertexShader,
                        fragmentShader,
                        uniforms,
                        transparent: true,
                        depthWrite:  false,
                        blending:    THREE.AdditiveBlending,
                    });
                    const wMesh = new THREE.LineSegments(wGeo, mat);
                    wMesh.position.copy(child.getWorldPosition(new THREE.Vector3()));
                    wMesh.rotation.copy(child.getWorldQuaternion(new THREE.Quaternion()));
                    wireGroup.add(wMesh);
                });

                /* Auto-center & scale to fit */
                const box    = new THREE.Box3().setFromObject(wireGroup);
                const size   = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale  = 2.2 / maxDim;

                wireGroup.scale.setScalar(scale);
                wireGroup.position.sub(center.multiplyScalar(scale));

                scene.add(wireGroup);
                mesh = wireGroup;

                /* Show container */
                container.classList.add('hero-3d-ready');
            },
            undefined,
            (err) => console.warn('[Hero3D] GLB load error:', err)
        );

        /* --- Point lights for extra depth --- */
        const light1 = new THREE.PointLight('#FF6B35', 1.2, 10);
        light1.position.set(2, 2, 3);
        scene.add(light1);

        const light2 = new THREE.PointLight('#4D8CFF', 0.8, 10);
        light2.position.set(-2, -1, 2);
        scene.add(light2);

        /* --- Events --- */
        bindEvents(THREE, uniforms);

        /* --- RAF Loop --- */
        let clock = { start: performance.now() };
        function tick() {
            animFrameId = requestAnimationFrame(tick);

            const t = (performance.now() - clock.start) * 0.001;
            uniforms.uTime.value = t;

            /* Smooth hover uniform */
            const targetHover = isHovered ? 1 : 0;
            uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.06;

            if (mesh) {
                /* Apply inertia */
                if (!isDragging) {
                    rotVel.x *= DRAG_DAMP;
                    rotVel.y *= DRAG_DAMP;

                    /* Auto-rotate when velocity is low */
                    if (Math.abs(rotVel.y) < 0.0005) {
                        mesh.rotation.y += AUTO_SPEED;
                    } else {
                        mesh.rotation.y += rotVel.y;
                        mesh.rotation.x += rotVel.x;
                    }
                }

                /* Hover: gentle bob */
                if (isHovered) {
                    mesh.position.y = Math.sin(t * 1.8) * 0.04;
                } else {
                    mesh.position.y *= 0.95; // settle back
                }
            }

            renderer.render(scene, camera);
        }
        tick();

        /* --- Resize --- */
        window.addEventListener('resize', () => resize(THREE), { passive: true });
    }


    /* ---- Resize handler ---- */
    function resize(THREE) {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (renderer) {
            renderer.setSize(w, h);
        }
        if (camera) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
    }


    /* ---- Input events ---- */
    function bindEvents(THREE, uniforms) {
        const el = renderer.domElement;

        /* Hover */
        container.addEventListener('mouseenter', () => { isHovered = true;  });
        container.addEventListener('mouseleave', () => { isHovered = false; isDragging = false; });

        /* Drag — mouse */
        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            prevMouse  = { x: e.clientX, y: e.clientY };
            rotVel     = { x: 0, y: 0 };
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging || !mesh) return;
            const dx = e.clientX - prevMouse.x;
            const dy = e.clientY - prevMouse.y;
            rotVel.y  = dx * DRAG_SPEED;
            rotVel.x  = dy * DRAG_SPEED;
            mesh.rotation.y += rotVel.y;
            mesh.rotation.x += rotVel.x;
            prevMouse = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        /* Drag — touch */
        let touchPrev = { x: 0, y: 0 };

        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            touchPrev  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            rotVel     = { x: 0, y: 0 };
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging || !mesh) return;
            const dx = e.touches[0].clientX - touchPrev.x;
            const dy = e.touches[0].clientY - touchPrev.y;
            rotVel.y  = dx * DRAG_SPEED;
            rotVel.x  = dy * DRAG_SPEED;
            mesh.rotation.y += rotVel.y;
            mesh.rotation.x += rotVel.x;
            touchPrev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        container.addEventListener('touchend', () => { isDragging = false; });
    }

    /* ---- Pause when section leaves ---- */
    window.addEventListener('sectionleave', (e) => {
        if (e.detail?.id === 'hero' && animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
    });

    window.addEventListener('sectionenter', (e) => {
        if (e.detail?.id === 'hero' && !animFrameId && renderer) {
            /* Re-trigger RAF if renderer exists */
        }
    });

})();