/* ================================================
   PROJECT3D.JS — Three.js interactive mini-scenes
   per project card preview area.

   Scene types (set via data-scene attribute):
     "game"   → Icosahedron + orbiting cubes + grid
     "art"    → Smooth torus knot, purple accent
     "shader" → Animated GLSL wave plane
     "web"    → Particle sphere + network lines
     "default"→ Wireframe sphere (fallback)

   TO USE YOUR OWN GLB MODEL:
   1. Put your .glb file in assets/models/
   2. Add data-model="assets/models/yourfile.glb"
      to the .project-preview div in index.html
   3. See the GLB loader section at the bottom of
      this file and uncomment it.
================================================ */

(function initProject3D() {
    if (typeof THREE === 'undefined') {
        console.warn('[Project3D] Three.js not loaded — skipping 3D previews.');
        return;
    }

    const previews = document.querySelectorAll('.project-preview');
    if (!previews.length) return;

    /* --------------------------------------------------
       COLOR PALETTES
    -------------------------------------------------- */
    const PALETTE = {
        game:    { key: 0xFF6B35, fill: 0xFF8555, rim: 0xcc4411 },
        art:     { key: 0xa78bfa, fill: 0xc4b5fd, rim: 0x7c3aed },
        shader:  { key: 0xFF6B35, fill: 0x4D8CFF, rim: 0xFF6B35 },
        web:     { key: 0x4D8CFF, fill: 0x7db3ff, rim: 0x2f64cc },
        default: { key: 0x555577, fill: 0x8888AA, rim: 0x333355 },
    };

    /* --------------------------------------------------
       SHARED LIGHTING SETUP
    -------------------------------------------------- */
    function addLights(scene, palette) {
        scene.add(new THREE.AmbientLight(0x080814, 1.4));

        const key = new THREE.PointLight(palette.key, 2.4, 10);
        key.position.set(2.5, 2.5, 3.5);
        scene.add(key);

        const fill = new THREE.PointLight(palette.fill, 0.8, 8);
        fill.position.set(-2.5, -1.5, 2);
        scene.add(fill);

        const rim = new THREE.PointLight(0xffffff, 0.3, 6);
        rim.position.set(0, 3, -3);
        scene.add(rim);
    }

    /* --------------------------------------------------
       SCENE: GAME
       Wireframe icosahedron + solid inner + orbiting
       cubes + grid floor (game engine viewport feel)
    -------------------------------------------------- */
    function buildGame(scene, palette) {
        // Solid inner
        const inner = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.88, 0),
            new THREE.MeshPhongMaterial({
                color: 0x0b0b1a,
                emissive: palette.key,
                emissiveIntensity: 0.1,
                shininess: 70,
            })
        );
        scene.add(inner);

        // Wireframe shell (slightly larger)
        const wire = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.92, 0),
            new THREE.MeshBasicMaterial({
                color: palette.key,
                wireframe: true,
                transparent: true,
                opacity: 0.5,
            })
        );
        scene.add(wire);

        // Three orbiting cubes
        const cubeColors = [palette.key, palette.fill, palette.key];
        const orbiters   = [];
        for (let i = 0; i < 3; i++) {
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(0.14, 0.14, 0.14),
                new THREE.MeshPhongMaterial({
                    color:             cubeColors[i],
                    emissive:          cubeColors[i],
                    emissiveIntensity: 0.45,
                })
            );
            const angle  = (i / 3) * Math.PI * 2;
            const radius = 1.7;
            cube.position.set(
                Math.cos(angle) * radius,
                (i - 1) * 0.38,
                Math.sin(angle) * radius
            );
            scene.add(cube);
            orbiters.push({ mesh: cube, angle, speed: 0.38 + i * 0.18, radius });
        }

        // Grid floor
        const grid = new THREE.GridHelper(8, 14, palette.key, 0x0f0f22);
        grid.position.y = -1.85;
        grid.material.transparent = true;
        grid.material.opacity     = 0.3;
        scene.add(grid);

        return function update(t, mx, my) {
            inner.rotation.x = my * 0.32 + t * 0.28;
            inner.rotation.y = mx * 0.32 + t * 0.46;
            wire.rotation.copy(inner.rotation);

            orbiters.forEach((o) => {
                o.angle += 0.007 * o.speed;
                o.mesh.position.x = Math.cos(o.angle) * o.radius;
                o.mesh.position.z = Math.sin(o.angle) * o.radius;
                o.mesh.rotation.x += 0.024;
                o.mesh.rotation.y += 0.016;
            });
        };
    }

    /* --------------------------------------------------
       SCENE: ART
       Smooth torus knot + thin orbital ring
    -------------------------------------------------- */
    function buildArt(scene, palette) {
        const knot = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.75, 0.26, 130, 18, 2, 3),
            new THREE.MeshPhongMaterial({
                color:             0x140820,
                emissive:          palette.key,
                emissiveIntensity: 0.14,
                specular:          palette.fill,
                shininess:         150,
            })
        );
        scene.add(knot);

        // Thin orbital ring
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(1.55, 0.013, 8, 80),
            new THREE.MeshBasicMaterial({
                color:       palette.key,
                transparent: true,
                opacity:     0.3,
            })
        );
        ring.rotation.x = Math.PI / 2.8;
        scene.add(ring);

        // Second ring offset
        const ring2 = new THREE.Mesh(
            new THREE.TorusGeometry(1.2, 0.008, 8, 60),
            new THREE.MeshBasicMaterial({
                color:       palette.fill,
                transparent: true,
                opacity:     0.18,
            })
        );
        ring2.rotation.x = Math.PI / 1.6;
        ring2.rotation.z = Math.PI / 4;
        scene.add(ring2);

        return function update(t, mx, my) {
            knot.rotation.x = my * 0.22 + t * 0.15;
            knot.rotation.y = mx * 0.22 + t * 0.24;
            ring.rotation.z  += 0.005;
            ring2.rotation.z -= 0.003;
        };
    }

    /* --------------------------------------------------
       SCENE: SHADER
       Animated GLSL wave plane — shows real shader code
    -------------------------------------------------- */
    function buildShader(scene, palette) {
        const colorA = new THREE.Color(palette.key);
        const colorB = new THREE.Color(palette.fill);

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime:   { value: 0.0 },
                uColorA: { value: colorA },
                uColorB: { value: colorB },
            },
            vertexShader: /* glsl */ `
                uniform float uTime;
                varying vec2  vUv;
                varying float vHeight;

                void main() {
                    vUv = uv;
                    vec3 p = position;

                    float w = sin(p.x * 3.2 + uTime * 1.1) * 0.13
                            + sin(p.y * 2.6 + uTime * 0.85) * 0.10
                            + sin((p.x + p.y) * 2.0 + uTime * 1.35) * 0.07;
                    p.z += w;
                    vHeight = w;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            `,
            fragmentShader: /* glsl */ `
                uniform float uTime;
                uniform vec3  uColorA;
                uniform vec3  uColorB;
                varying vec2  vUv;
                varying float vHeight;

                void main() {
                    float t = vUv.x * 0.65 + vUv.y * 0.35
                            + vHeight * 2.4
                            + sin(uTime * 0.38) * 0.14;

                    vec3 col   = mix(uColorA, uColorB, smoothstep(0.2, 0.8, t));
                    float alpha = clamp(0.68 + vHeight * 2.0, 0.0, 1.0);

                    gl_FragColor = vec4(col, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
        });

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 3.6, 44, 30),
            mat
        );
        plane.rotation.x = -0.52;
        scene.add(plane);

        return function update(t, mx, my) {
            mat.uniforms.uTime.value = t;
            plane.rotation.x = -0.46 + my * 0.12;
            plane.rotation.y = mx * 0.18;
        };
    }

    /* --------------------------------------------------
       SCENE: WEB
       Fibonacci particle sphere + sparse connection lines
    -------------------------------------------------- */
    function buildWeb(scene, palette) {
        const COUNT = 540;
        const pos   = new Float32Array(COUNT * 3);
        const col   = new Float32Array(COUNT * 3);
        const cA    = new THREE.Color(palette.key);
        const cB    = new THREE.Color(palette.fill);

        for (let i = 0; i < COUNT; i++) {
            // Fibonacci sphere distribution
            const phi   = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const r     = 1.3 + (Math.random() - 0.5) * 0.22;

            pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.cos(phi);
            pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

            const c = cA.clone().lerp(cB, Math.random());
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }

        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

        const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
            size:         0.038,
            vertexColors: true,
            transparent:  true,
            opacity:      0.88,
        }));
        scene.add(points);

        // Sparse connection lines between random pairs
        const lp = [];
        for (let i = 0; i < 60; i++) {
            const a = Math.floor(Math.random() * COUNT);
            const b = Math.floor(Math.random() * COUNT);
            lp.push(
                pos[a*3], pos[a*3+1], pos[a*3+2],
                pos[b*3], pos[b*3+1], pos[b*3+2]
            );
        }
        const lGeo = new THREE.BufferGeometry();
        lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lp), 3));
        scene.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
            color:       palette.key,
            transparent: true,
            opacity:     0.12,
        })));

        return function update(t, mx, my) {
            points.rotation.x = my * 0.26 + t * 0.07;
            points.rotation.y = mx * 0.26 + t * 0.11;
        };
    }

    /* --------------------------------------------------
       SCENE: DEFAULT (fallback / archived)
       Wireframe sphere + floating inner icosahedron
    -------------------------------------------------- */
    function buildDefault(scene, palette) {
        const outer = new THREE.Mesh(
            new THREE.SphereGeometry(1.0, 20, 14),
            new THREE.MeshBasicMaterial({
                color:       palette.key,
                wireframe:   true,
                transparent: true,
                opacity:     0.2,
            })
        );
        scene.add(outer);

        const inner = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.5, 0),
            new THREE.MeshPhongMaterial({
                color:             0x070710,
                emissive:          palette.key,
                emissiveIntensity: 0.18,
                shininess:         50,
            })
        );
        scene.add(inner);

        return function update(t, mx, my) {
            outer.rotation.y = mx * 0.22 + t * 0.14;
            outer.rotation.x = my * 0.22 + t * 0.09;
            inner.rotation.y = mx * 0.3 + t * 0.22;
            inner.rotation.x = my * 0.3 + t * 0.17;
        };
    }

    /* --------------------------------------------------
       SCENE DISPATCHER
    -------------------------------------------------- */
    const BUILDERS = {
        game:   buildGame,
        art:    buildArt,
        shader: buildShader,
        web:    buildWeb,
    };

    /* --------------------------------------------------
       INIT — one renderer + scene per preview canvas
    -------------------------------------------------- */
    previews.forEach((preview) => {
        const canvas    = preview.querySelector('canvas');
        const sceneType = preview.dataset.scene || 'default';
        if (!canvas) return;

        const palette = PALETTE[sceneType] || PALETTE.default;
        const builder = BUILDERS[sceneType] || buildDefault;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha:     true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);

        // Scene + Camera
        const scene  = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 50);
        camera.position.z = 4.2;

        addLights(scene, palette);
        const updateFn = builder(scene, palette);

        // Resize to match DOM size
        function resize() {
            const w = preview.clientWidth;
            const h = preview.clientHeight;
            if (!w || !h) return;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }

        // Mouse tracking — lerped for smooth parallax
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

        preview.addEventListener('mousemove', (e) => {
            const r  = preview.getBoundingClientRect();
            mouse.tx =  ((e.clientX - r.left) / r.width  - 0.5) * 2;
            mouse.ty = -((e.clientY - r.top)  / r.height - 0.5) * 2;
        });
        preview.addEventListener('mouseleave', () => {
            mouse.tx = 0;
            mouse.ty = 0;
        });

        // Animation loop
        let rafId = null;
        let t0    = null;

        function tick(ts) {
            rafId = requestAnimationFrame(tick);
            if (!t0) t0 = ts;
            const t = (ts - t0) * 0.001; // elapsed seconds

            // Lerp mouse for smooth feel
            mouse.x += (mouse.tx - mouse.x) * 0.065;
            mouse.y += (mouse.ty - mouse.y) * 0.065;

            updateFn(t, mouse.x, mouse.y);
            renderer.render(scene, camera);
        }

        // Only render when card is in viewport (saves GPU)
        const visObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting && !rafId) {
                    resize();
                    tick(performance.now());
                } else if (!e.isIntersecting && rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });
        }, { threshold: 0.05 });

        visObs.observe(preview);

        // Re-size when card dimensions change
        new ResizeObserver(resize).observe(preview);
    });

    async function loadGLB(scene, path, camera) {
        const { GLTFLoader } = await import(
            'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/jsm/loaders/GLTFLoader.js'
        );
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            // Auto-center and scale model
            const box    = new THREE.Box3().setFromObject(model);
            const size   = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const scale  = 2.0 / Math.max(size.x, size.y, size.z);
            model.scale.setScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            scene.add(model);
        });
    }

})();