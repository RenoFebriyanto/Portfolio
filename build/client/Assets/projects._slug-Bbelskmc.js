const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/GLTFLoader-nBVbhmug.js","assets/three.module-BX2Vlr8r.js"])))=>i.map(i=>d[i]);
import{r as g,j as e,a as V,w as re,b as te}from"./jsx-runtime-CFh6JGtC.js";import{a as ne,_ as Y,u as ie,g as _,p as oe}from"./useSnapNavigation-DSUpJw01.js";function le(){g.useEffect(()=>{const n=document.createElement("style");return n.id="fs-cursor-override",n.textContent=`
      [data-page="forbidden-space"] ~ * .cursor-dot,
      body.fs-page-active .cursor-dot {
        background: #00c8ff !important;
        box-shadow: 0 0 8px #00c8ff, 0 0 16px rgba(0,200,255,0.4) !important;
      }
      body.fs-page-active .cursor-ring {
        border-color: #00c8ff !important;
      }
      body.fs-page-active.cursor-hover .cursor-ring {
        border-color: #00c8ff !important;
        background: rgba(0,200,255,0.08) !important;
        width: 56px !important;
        height: 56px !important;
      }
      body.fs-page-active .cursor-dot { background: #00c8ff !important; }
    `,document.head.appendChild(n),document.body.classList.add("fs-page-active"),()=>{n.remove(),document.body.classList.remove("fs-page-active")}},[])}function ce(){const[n,o]=g.useState("enter");return g.useEffect(()=>{const l=setTimeout(()=>o("visible"),80);return()=>clearTimeout(l)},[]),{phase:n,exit:l=>{o("exit"),setTimeout(l,700)}}}function de(n){g.useEffect(()=>{const o=n.current;if(!o)return;const r=o.getContext("2d");if(!r)return;let l=0,m=0;const a={r:0,g:200,b:255},c={r:255,g:107,b:53},v=120;let s=[],d=0;function i(){l=o.width=window.innerWidth,m=o.height=window.innerHeight}i(),window.addEventListener("resize",i,{passive:!0});function f(t,u){return Math.random()*(u-t)+t}s=Array.from({length:v},()=>({x:f(0,l),y:f(0,m),r:f(.5,2.2),vy:f(.015,.1),vx:f(-.03,.03),alpha:f(.06,.45),pulse:f(0,Math.PI*2),ps:f(.003,.012),tint:Math.random()<.1?c:a}));function h(){r.clearRect(0,0,l,m),s.forEach(t=>{t.pulse+=t.ps;const u=t.alpha*(.5+.5*Math.sin(t.pulse));r.beginPath(),r.arc(t.x,t.y,t.r,0,Math.PI*2),r.fillStyle=`rgba(${t.tint.r},${t.tint.g},${t.tint.b},${u})`,r.fill(),t.x+=t.vx,t.y-=t.vy,t.y<-4&&(t.y=m+4,t.x=f(0,l)),t.x<-4&&(t.x=l+4),t.x>l+4&&(t.x=-4)}),d=requestAnimationFrame(h)}return h(),()=>{cancelAnimationFrame(d),window.removeEventListener("resize",i)}},[n])}function pe(){g.useEffect(()=>{const n=document.querySelectorAll(".fs-reveal");if(!n.length)return;const o=new IntersectionObserver(r=>r.forEach(l=>{l.isIntersecting&&(l.target.classList.add("fs-revealed"),o.unobserve(l.target))}),{threshold:.12,rootMargin:"0px 0px -60px 0px"});return n.forEach(r=>o.observe(r)),()=>o.disconnect()},[])}function fe({text:n,className:o=""}){return e.jsx("span",{className:`fs-glitch ${o}`,"data-text":n,children:n})}function he({src:n,onClose:o}){return g.useEffect(()=>{const r=l=>{l.key==="Escape"&&o()};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[o]),e.jsxs("div",{className:"fs-lightbox",onClick:o,children:[e.jsx("button",{className:"fs-lightbox__close",onClick:o,children:"✕"}),e.jsxs("div",{className:"fs-lightbox__frame",onClick:r=>r.stopPropagation(),children:[e.jsx("div",{className:"fs-lightbox__scan"}),e.jsx("img",{src:n,alt:"Screenshot",className:"fs-lightbox__img"}),e.jsx("div",{className:"fs-lightbox__corner fs-lightbox__corner--tl"}),e.jsx("div",{className:"fs-lightbox__corner fs-lightbox__corner--tr"}),e.jsx("div",{className:"fs-lightbox__corner fs-lightbox__corner--bl"}),e.jsx("div",{className:"fs-lightbox__corner fs-lightbox__corner--br"})]})]})}function me(){const n=g.useRef(null),[o,r]=g.useState(null),{phase:l}=ce();le(),de(n),pe();const m=["https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5NDQ3MS5wbmc=/original/RVvsqd.png","https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MTk2MC5wbmc=/original/G5mEIZ.png","https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MTkyNy5wbmc=/original/tQvQJg.png","https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI4OS5wbmc=/original/nxHC5y.png","https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI5Mi5wbmc=/original/rW0scz.png","https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI5My5wbmc=/original/NJ7BSU.png","https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI4OC5wbmc=/original/q2KVKO.png","https://img.itch.zone/aW1hZ2UvNDU5NzUxNS8yNzM5MzI5MC5wbmc=/original/kZKuG9.png"],a=[{num:"01",title:"Boss Fight Programming",icon:"⬡",tags:["C#","Unity","Boss AI","UI System"],desc:"Designed and implemented the entire boss encounter system — multi-phase AI state machines, attack logic, and in-game UI for boss health & phase indicators."},{num:"02",title:"Boss VFX Artist",icon:"◈",tags:["VFX Graph","Shader Graph"],desc:"Created all visual effects for the boss fight — portal summons, slam shockwaves, laser beams, projectile effects, hit reactions, and death VFX."}],c=[{initials:"RFK",name:"Robbani Fadhillah Kafura",role:"Game Designer · Programmer",isMe:!1},{initials:"RF",name:"Reno Febriyanto",role:"Programmer · VFX Artist",isMe:!0},{initials:"AFK",name:"Adinda Fadilla Kirana Dewi",role:"Game Artist 2D",isMe:!1},{initials:"PP",name:"Putu Pande",role:"Game Artist 2D",isMe:!1}],v=[{value:"2D",label:"Art Style"},{value:"∞",label:"Time Loops"},{value:"4",label:"Team Members"},{value:"HTML5",label:"Platform"}];return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        /* ── Token Layer ── */
        [data-page="forbidden-space"] {
          --fs-void:        #010b0f;
          --fs-deep:        #011218;
          --fs-dark:        #021820;
          --fs-panel:       #041e28;
          --fs-panel-hi:    #062633;
          --fs-border:      rgba(0,200,255,0.10);
          --fs-border-hi:   rgba(0,200,255,0.28);
          --fs-cyan:        #00c8ff;
          --fs-cyan-dim:    rgba(0,200,255,0.12);
          --fs-cyan-glow:   rgba(0,200,255,0.35);
          --fs-cyan-hard:   rgba(0,200,255,0.70);
          --fs-orange:      #FF6B35;
          --fs-orange-dim:  rgba(255,107,53,0.12);
          --fs-text:        #cce8f0;
          --fs-text-2:      #6da8b8;
          --fs-text-3:      #2e5a68;
          --fs-ease:        cubic-bezier(0.16,1,0.3,1);
        }

        /* ── Page-enter / exit transition ── */
        .fs-wrapper {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity   0.65s var(--fs-ease),
            transform 0.65s var(--fs-ease);
        }
        .fs-wrapper.phase-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .fs-wrapper.phase-exit {
          opacity: 0;
          transform: translateY(-18px);
          transition:
            opacity   0.45s ease,
            transform 0.45s ease;
        }

        /* ── Scanline overlay ── */
        .fs-scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.018) 2px, rgba(0,0,0,0.018) 4px
          );
        }

        /* ── Particle canvas ── */
        .fs-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.55;
        }

        /* ── Grid background ── */
        .fs-grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.024) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, rgba(0,0,0,0.7) 0%, transparent 75%);
        }

        /* ── Top glow ── */
        .fs-top-glow {
          position: fixed;
          top: -300px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,200,255,0.055) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Nav ── */
        .fs-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid rgba(0,200,255,0.05);
          background: linear-gradient(to bottom, rgba(1,11,15,0.96) 0%, transparent 100%);
          backdrop-filter: blur(12px);
        }
        .fs-nav__back {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--fs-text-2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .fs-nav__back:hover { color: var(--fs-cyan); }
        .fs-nav__back-arrow {
          display: inline-block;
          transition: transform 0.2s;
        }
        .fs-nav__back:hover .fs-nav__back-arrow { transform: translateX(-3px); }
        .fs-nav__center {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fs-nav__badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          padding: 4px 10px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.28);
          border-radius: 3px;
          color: var(--fs-cyan);
          text-transform: uppercase;
        }
        .fs-nav__title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--fs-text);
          text-transform: uppercase;
        }
        .fs-nav__cta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          color: var(--fs-cyan);
          border: 1px solid rgba(0,200,255,0.18);
          padding: 8px 18px;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .fs-nav__cta:hover {
          background: rgba(0,200,255,0.08);
          border-color: rgba(0,200,255,0.4);
        }

        /* ── Content wrapper ── */
        .fs-content {
          position: relative;
          z-index: 2;
          background: var(--fs-void);
          min-height: 100vh;
          color: var(--fs-text);
          overflow: hidden;
        }

        /* ── Hero ── */
        .fs-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 140px 80px 100px;
          gap: 72px;
          position: relative;
        }
        .fs-hero__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }
        .fs-hero__tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          padding: 5px 12px;
          border-radius: 3px;
          text-transform: uppercase;
        }
        .fs-hero__tag--cyan {
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.3);
          color: var(--fs-cyan);
        }
        .fs-hero__tag--orange {
          background: rgba(255,107,53,0.08);
          border: 1px solid rgba(255,107,53,0.3);
          color: var(--fs-orange);
        }
        .fs-hero__tag--neutral {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--fs-text-2);
        }
        .fs-hero__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(72px, 10vw, 130px);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .fs-hero__heading-line1 {
          display: block;
          color: var(--fs-text);
        }
        .fs-hero__heading-line2 {
          display: block;
          color: transparent;
          -webkit-text-stroke: 2px var(--fs-cyan);
          text-shadow:
            0 0 40px rgba(0,200,255,0.5),
            0 0 80px rgba(0,200,255,0.2);
        }
        .fs-hero__tagline {
          font-size: 1.05rem;
          color: var(--fs-text-2);
          max-width: 400px;
          margin-bottom: 20px;
          font-style: italic;
          line-height: 1.7;
        }
        .fs-hero__role-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 44px;
        }
        .fs-hero__role-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          color: var(--fs-text-3);
          text-transform: uppercase;
        }
        .fs-hero__role-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: var(--fs-cyan);
          letter-spacing: 0.04em;
        }
        .fs-hero__cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .fs-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 30px;
          background: var(--fs-cyan);
          color: #010b0f;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          font-weight: 600;
          border-radius: 4px;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          text-transform: uppercase;
        }
        .fs-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,200,255,0.3);
        }
        .fs-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 30px;
          border: 1px solid var(--fs-border-hi);
          color: var(--fs-text-2);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          border-radius: 4px;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
          text-transform: uppercase;
        }
        .fs-btn-outline:hover {
          border-color: var(--fs-cyan);
          color: var(--fs-cyan);
          transform: translateY(-2px);
        }

        /* ── Hero image panel ── */
        .fs-hero__img-wrap {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--fs-border-hi);
          box-shadow:
            0 0 0 1px rgba(0,200,255,0.06),
            0 40px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(0,200,255,0.08);
        }
        .fs-hero__img-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(105deg, transparent, rgba(0,200,255,0.06) 45%, rgba(0,200,255,0.12) 50%, rgba(0,200,255,0.06) 55%, transparent);
          pointer-events: none;
          animation: fs-shimmer 4s ease-in-out 1s infinite;
          z-index: 2;
        }
        @keyframes fs-shimmer { to { left: 140%; } }
        .fs-hero__img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,200,255,0.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }
        .fs-hero__img {
          width: 100%;
          display: block;
          position: relative;
          z-index: 0;
        }
        /* Corner brackets */
        .fs-hero__img-wrap .fs-corner { position: absolute; width: 16px; height: 16px; z-index: 3; }
        .fs-hero__img-wrap .fs-corner--tl { top: 8px;  left: 8px;  border-top: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-hero__img-wrap .fs-corner--tr { top: 8px;  right: 8px; border-top: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }
        .fs-hero__img-wrap .fs-corner--bl { bottom: 8px; left: 8px;  border-bottom: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-hero__img-wrap .fs-corner--br { bottom: 8px; right: 8px; border-bottom: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }

        /* ── Glitch text ── */
        .fs-glitch {
          position: relative;
          display: inline-block;
        }
        .fs-glitch::before,
        .fs-glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
        }
        .fs-glitch::before {
          color: var(--fs-cyan);
          animation: fs-glitch-top 6s infinite linear;
          opacity: 0;
        }
        .fs-glitch::after {
          color: var(--fs-orange);
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          animation: fs-glitch-bot 6s infinite linear;
          opacity: 0;
        }
        @keyframes fs-glitch-top {
          0%,93%,95.5%,100% { transform: translate(0); opacity: 0; }
          94%   { transform: translate(-3px, 1px); opacity: 0.7; }
          95%   { transform: translate(3px, -1px); opacity: 0.7; }
        }
        @keyframes fs-glitch-bot {
          0%,93%,95.5%,100% { transform: translate(0); opacity: 0; }
          94%   { transform: translate(3px, 1px);  opacity: 0.7; }
          95%   { transform: translate(-3px,-1px); opacity: 0.7; }
        }

        /* ── Section layout ── */
        .fs-section {
          padding: 110px 0;
          position: relative;
          z-index: 2;
        }
        .fs-section--dark {
          background: linear-gradient(to bottom, var(--fs-void), var(--fs-dark));
        }
        .fs-section--darker {
          background: linear-gradient(to bottom, var(--fs-dark), var(--fs-deep));
        }
        .fs-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 64px;
        }
        .fs-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: var(--fs-cyan);
          opacity: 0.7;
          text-transform: uppercase;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fs-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--fs-cyan);
          opacity: 0.5;
        }

        /* ── Story section ── */
        .fs-story-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .fs-story__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: 36px;
          color: var(--fs-text);
        }
        .fs-story__p {
          color: var(--fs-text-2);
          line-height: 1.8;
          margin-bottom: 18px;
          font-size: 0.95rem;
        }
        .fs-story__p em { color: var(--fs-cyan); font-style: normal; }
        .fs-story__p strong { color: var(--fs-text); font-weight: 500; }

        /* Stats grid */
        .fs-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          border: 1px solid var(--fs-border);
          border-radius: 6px;
          overflow: hidden;
        }
        .fs-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          background: var(--fs-panel);
          text-align: center;
          transition: background 0.2s;
        }
        .fs-stat:hover { background: var(--fs-panel-hi); }
        .fs-stat__val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: var(--fs-cyan);
          line-height: 1;
          margin-bottom: 8px;
        }
        .fs-stat__label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          color: var(--fs-text-2);
          text-transform: uppercase;
        }

        /* ── Video embed ── */
        .fs-video-wrap {
          max-width: 800px;
        }
        .fs-video-frame {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--fs-border-hi);
          box-shadow:
            0 0 0 1px rgba(0,200,255,0.04),
            0 32px 80px rgba(0,0,0,0.5);
        }
        .fs-video-frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .fs-video-caption {
          margin-top: 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: var(--fs-text-3);
        }

        /* ── Screenshots gallery ── */
        .fs-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .fs-gallery__item {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          border: 1px solid var(--fs-border);
          cursor: zoom-in;
          background: var(--fs-panel);
        }
        .fs-gallery__item--tall {
          grid-row: span 2;
        }
        .fs-gallery__item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,200,255,0.06) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .fs-gallery__item:hover::after { opacity: 1; }
        .fs-gallery__item:hover { border-color: rgba(0,200,255,0.25); }
        .fs-gallery__item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .fs-gallery__item:hover img { transform: scale(1.04); }
        /* Zoom icon */
        .fs-gallery__item::before {
          content: '⊕';
          position: absolute;
          top: 10px;
          right: 12px;
          font-size: 1rem;
          color: var(--fs-cyan);
          opacity: 0;
          z-index: 2;
          transition: opacity 0.2s;
        }
        .fs-gallery__item:hover::before { opacity: 0.7; }

        /* ── Lightbox ── */
        .fs-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(1,11,15,0.96);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fs-lb-in 0.25s ease forwards;
        }
        @keyframes fs-lb-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fs-lightbox__close {
          position: absolute;
          top: 28px;
          right: 36px;
          background: none;
          border: none;
          font-size: 1.4rem;
          color: var(--fs-text-2);
          cursor: pointer;
          transition: color 0.2s;
          font-family: monospace;
        }
        .fs-lightbox__close:hover { color: var(--fs-cyan); }
        .fs-lightbox__frame {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 4px;
          overflow: hidden;
          animation: fs-lb-scale 0.3s var(--fs-ease, cubic-bezier(0.16,1,0.3,1)) forwards;
        }
        @keyframes fs-lb-scale {
          from { transform: scale(0.94); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .fs-lightbox__img {
          display: block;
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 4px;
          border: 1px solid var(--fs-border-hi);
        }
        .fs-lightbox__scan {
          position: absolute;
          top: -4px; left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--fs-cyan), transparent);
          z-index: 3;
          opacity: 0.6;
          animation: fs-scan 2.2s linear infinite;
        }
        @keyframes fs-scan {
          from { top: -4px; }
          to   { top: 100%; }
        }
        .fs-lightbox__corner {
          position: absolute;
          width: 18px;
          height: 18px;
          z-index: 4;
        }
        .fs-lightbox__corner--tl { top: 6px;    left: 6px;   border-top: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-lightbox__corner--tr { top: 6px;    right: 6px;  border-top: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }
        .fs-lightbox__corner--bl { bottom: 6px; left: 6px;   border-bottom: 1.5px solid var(--fs-cyan); border-left: 1.5px solid var(--fs-cyan); }
        .fs-lightbox__corner--br { bottom: 6px; right: 6px;  border-bottom: 1.5px solid var(--fs-cyan); border-right: 1.5px solid var(--fs-cyan); }

        /* ── Contribution cards ── */
        .fs-contrib-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .fs-contrib-card {
          padding: 44px 40px;
          background: var(--fs-panel);
          border: 1px solid var(--fs-border);
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, background 0.3s;
        }
        .fs-contrib-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--fs-cyan), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .fs-contrib-card:hover { background: var(--fs-panel-hi); border-color: var(--fs-border-hi); }
        .fs-contrib-card:hover::before { opacity: 1; }

        .fs-contrib-card__num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 5rem;
          font-weight: 800;
          color: rgba(0,200,255,0.08);
          line-height: 1;
          margin-bottom: 20px;
          user-select: none;
        }
        .fs-contrib-card__icon {
          font-size: 1.4rem;
          color: var(--fs-cyan);
          margin-bottom: 14px;
          display: block;
          opacity: 0.6;
        }
        .fs-contrib-card__title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--fs-text);
          margin-bottom: 14px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .fs-contrib-card__desc {
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--fs-text-2);
          margin-bottom: 24px;
        }
        .fs-contrib-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .fs-contrib-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          padding: 3px 10px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 3px;
          color: var(--fs-cyan);
          text-transform: uppercase;
        }

        /* ── Team grid ── */
        .fs-team-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
        }
        .fs-team-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 24px 32px;
          background: var(--fs-panel);
          border: 1px solid var(--fs-border);
          position: relative;
          transition: border-color 0.2s, background 0.2s;
        }
        .fs-team-card:hover {
          background: var(--fs-panel-hi);
          border-color: rgba(0,200,255,0.16);
        }
        .fs-team-card--me {
          border-color: rgba(0,200,255,0.28) !important;
        }
        .fs-team-card__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .fs-team-card__avatar--me {
          background: rgba(0,200,255,0.12);
          border: 1px solid var(--fs-cyan);
          color: var(--fs-cyan);
        }
        .fs-team-card__avatar--other {
          background: var(--fs-dark);
          border: 1px solid var(--fs-border);
          color: var(--fs-text-2);
        }
        .fs-team-card__name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--fs-text);
          margin-bottom: 3px;
        }
        .fs-team-card__role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.67rem;
          color: var(--fs-text-2);
          letter-spacing: 0.04em;
        }
        .fs-team-card__you {
          position: absolute;
          top: 12px;
          right: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          padding: 2px 8px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.28);
          border-radius: 3px;
          color: var(--fs-cyan);
          text-transform: uppercase;
        }

        /* ── CTA section ── */
        .fs-cta {
          text-align: center;
          padding: 120px 0;
          position: relative;
          z-index: 2;
          background: var(--fs-void);
        }
        .fs-cta::before {
          content: '';
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(0,200,255,0.4));
        }
        .fs-cta__tagline {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          color: var(--fs-cyan);
          margin-bottom: 18px;
          font-style: italic;
        }
        .fs-cta__heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.8rem, 4vw, 3.2rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--fs-text);
          margin-bottom: 44px;
        }
        .fs-cta__buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ── Footer ── */
        .fs-footer {
          position: relative;
          z-index: 2;
          padding: 28px 0;
          border-top: 1px solid rgba(0,200,255,0.06);
          background: var(--fs-void);
        }
        .fs-footer__inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fs-footer__copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          color: var(--fs-text-3);
          letter-spacing: 0.06em;
        }
        .fs-footer__links {
          display: flex;
          gap: 28px;
        }
        .fs-footer__link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          color: var(--fs-text-2);
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        .fs-footer__link:hover { color: var(--fs-cyan); }

        /* ── Reveal animation ── */
        .fs-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s var(--fs-ease, cubic-bezier(0.16,1,0.3,1)),
                      transform 0.7s var(--fs-ease, cubic-bezier(0.16,1,0.3,1));
        }
        .fs-reveal.fs-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .fs-reveal.fs-delay-1 { transition-delay: 0.1s; }
        .fs-reveal.fs-delay-2 { transition-delay: 0.2s; }
        .fs-reveal.fs-delay-3 { transition-delay: 0.3s; }

        /* ── Decorative animated line ── */
        .fs-h-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,255,0.3) 30%, rgba(0,200,255,0.3) 70%, transparent);
          margin: 0;
        }

        /* ── Pulsing dot ── */
        .fs-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--fs-cyan);
          box-shadow: 0 0 8px rgba(0,200,255,0.6);
          animation: fs-pulse 2.5s ease-in-out infinite;
        }
        @keyframes fs-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.75); }
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .fs-hero { grid-template-columns: 1fr; padding: 120px 40px 80px; }
          .fs-story-grid { grid-template-columns: 1fr; gap: 48px; }
          .fs-contrib-grid { grid-template-columns: 1fr; }
          .fs-team-grid { grid-template-columns: 1fr; }
          .fs-container { padding: 0 32px; }
          .fs-footer__inner { padding: 0 32px; }
          .fs-nav { padding: 16px 24px; }
          .fs-nav__title { display: none; }
        }
        @media (max-width: 600px) {
          .fs-gallery { grid-template-columns: repeat(2, 1fr); }
          .fs-gallery__item--tall { grid-row: span 1; }
          .fs-hero__heading { font-size: clamp(52px, 14vw, 90px); }
        }
      `}),e.jsxs("div",{"data-page":"forbidden-space",children:[e.jsx("canvas",{ref:n,className:"fs-canvas"}),e.jsx("div",{className:"fs-scanlines"}),e.jsx("div",{className:"fs-grid-bg"}),e.jsx("div",{className:"fs-top-glow"}),e.jsxs("nav",{className:"fs-nav",children:[e.jsxs("a",{href:"/",className:"fs-nav__back",children:[e.jsx("span",{className:"fs-nav__back-arrow",children:"←"}),"Back to Portfolio"]}),e.jsxs("div",{className:"fs-nav__center",children:[e.jsx("span",{className:"fs-nav__badge",children:"Game"}),e.jsx("span",{className:"fs-nav__title",children:"Forbidden Space"})]}),e.jsx("a",{href:"https://wubblyduby.itch.io/forbidden-space",target:"_blank",rel:"noopener noreferrer",className:"fs-nav__cta",children:"Play on itch.io ↗"})]}),e.jsx("div",{className:`fs-wrapper phase-${l}`,children:e.jsxs("div",{className:"fs-content",children:[e.jsxs("section",{className:"fs-hero",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"fs-hero__tags",children:[e.jsx("span",{className:"fs-hero__tag fs-hero__tag--cyan",children:"ROGUELIKE · 2D · SHOOTER"}),e.jsx("span",{className:"fs-hero__tag fs-hero__tag--orange",children:"Unity"}),e.jsx("span",{className:"fs-hero__tag fs-hero__tag--neutral",children:"Released · 2026"})]}),e.jsxs("h1",{className:"fs-hero__heading",children:[e.jsx("span",{className:"fs-hero__heading-line1",children:e.jsx(fe,{text:"FORBIDDEN"})}),e.jsx("span",{className:"fs-hero__heading-line2",children:"SPACE"})]}),e.jsx("p",{className:"fs-hero__tagline",children:"A cosmic time-loop roguelike where death resets the universe."}),e.jsxs("div",{className:"fs-hero__role-row",children:[e.jsx("span",{className:"fs-dot"}),e.jsx("span",{className:"fs-hero__role-label",children:"My Role"}),e.jsx("span",{className:"fs-hero__role-value",children:"Programmer · VFX Artist"})]}),e.jsxs("div",{className:"fs-hero__cta",children:[e.jsx("a",{href:"https://wubblyduby.itch.io/forbidden-space",target:"_blank",rel:"noopener noreferrer",className:"fs-btn-primary",children:"Play Free on itch.io ↗"}),e.jsx("a",{href:"#overview",className:"fs-btn-outline",children:"Case Study ↓"})]})]}),e.jsxs("div",{className:"fs-hero__img-wrap",children:[e.jsx("img",{src:"/Assets/project/game/ForbiddenSpace/ForbiddenSpacePreview.png",alt:"Forbidden Space Preview",className:"fs-hero__img",onError:s=>{s.target.style.opacity="0"}}),e.jsx("div",{className:"fs-corner fs-corner--tl"}),e.jsx("div",{className:"fs-corner fs-corner--tr"}),e.jsx("div",{className:"fs-corner fs-corner--bl"}),e.jsx("div",{className:"fs-corner fs-corner--br"})]})]}),e.jsx("div",{className:"fs-h-line"}),e.jsx("section",{className:"fs-section fs-section--dark",id:"overview",children:e.jsxs("div",{className:"fs-container",children:[e.jsx("p",{className:"fs-eyebrow fs-reveal",children:"01 — Story"}),e.jsxs("div",{className:"fs-story-grid",children:[e.jsxs("div",{className:"fs-reveal fs-delay-1",children:[e.jsx("h2",{className:"fs-story__heading",children:"Trapped in a Cosmic Loop"}),e.jsxs("p",{className:"fs-story__p",children:["In a remote corner of the universe lies a mysterious place known as"," ",e.jsx("em",{children:'"The Forbidden Space."'})," It is the domain of a four-dimensional extraterrestrial being capable of manipulating time itself."]}),e.jsxs("p",{className:"fs-story__p",children:["Players take control of a spacecraft named"," ",e.jsx("strong",{children:'J4-RW0 — "Jarwo"'})," — who accidentally enters The Forbidden Space. Trapped within, Jarwo becomes nothing more than a plaything for the powerful entity, which endlessly resets and repeats time."]})]}),e.jsx("div",{className:"fs-stats-grid fs-reveal fs-delay-2",children:v.map(s=>e.jsxs("div",{className:"fs-stat",children:[e.jsx("div",{className:"fs-stat__val",children:s.value}),e.jsx("div",{className:"fs-stat__label",children:s.label})]},s.label))})]})]})}),e.jsx("div",{className:"fs-h-line"}),e.jsx("section",{className:"fs-section fs-section--darker",children:e.jsxs("div",{className:"fs-container",children:[e.jsx("p",{className:"fs-eyebrow fs-reveal",children:"02 — Gameplay"}),e.jsxs("div",{className:"fs-video-wrap fs-reveal fs-delay-1",children:[e.jsx("div",{className:"fs-video-frame",children:e.jsx("iframe",{src:"https://www.youtube.com/embed/jWMfVkl7hZA",title:"Forbidden Space Gameplay",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0})}),e.jsx("p",{className:"fs-video-caption",children:"Gameplay Trailer — Forbidden Space · 2026"})]})]})}),e.jsx("div",{className:"fs-h-line"}),e.jsx("section",{className:"fs-section fs-section--dark",children:e.jsxs("div",{className:"fs-container",children:[e.jsx("p",{className:"fs-eyebrow fs-reveal",children:"03 — Screenshots"}),e.jsx("div",{className:"fs-gallery fs-reveal fs-delay-1",children:m.map((s,d)=>e.jsx("div",{className:`fs-gallery__item${d===0||d===3?" fs-gallery__item--tall":""}`,onClick:()=>r(s),children:e.jsx("img",{src:s,alt:`Screenshot ${d+1}`,loading:"lazy"})},d))})]})}),e.jsx("div",{className:"fs-h-line"}),e.jsx("section",{className:"fs-section fs-section--darker",children:e.jsxs("div",{className:"fs-container",children:[e.jsx("p",{className:"fs-eyebrow fs-reveal",children:"04 — My Contribution"}),e.jsx("div",{className:"fs-contrib-grid",children:a.map(s=>e.jsxs("div",{className:"fs-contrib-card fs-reveal fs-delay-1",children:[e.jsx("div",{className:"fs-contrib-card__num",children:s.num}),e.jsx("span",{className:"fs-contrib-card__icon",children:s.icon}),e.jsx("h3",{className:"fs-contrib-card__title",children:s.title}),e.jsx("p",{className:"fs-contrib-card__desc",children:s.desc}),e.jsx("div",{className:"fs-contrib-card__tags",children:s.tags.map(d=>e.jsx("span",{className:"fs-contrib-tag",children:d},d))})]},s.num))})]})}),e.jsx("div",{className:"fs-h-line"}),e.jsx("section",{className:"fs-section fs-section--dark",children:e.jsxs("div",{className:"fs-container",children:[e.jsx("p",{className:"fs-eyebrow fs-reveal",children:"05 — Team"}),e.jsx("div",{className:"fs-team-grid fs-reveal fs-delay-1",children:c.map(s=>e.jsxs("div",{className:`fs-team-card${s.isMe?" fs-team-card--me":""}`,children:[e.jsx("div",{className:`fs-team-card__avatar${s.isMe?" fs-team-card__avatar--me":" fs-team-card__avatar--other"}`,children:s.initials}),e.jsxs("div",{children:[e.jsx("div",{className:"fs-team-card__name",children:s.name}),e.jsx("div",{className:"fs-team-card__role",children:s.role})]}),s.isMe&&e.jsx("span",{className:"fs-team-card__you",children:"You"})]},s.initials))})]})}),e.jsxs("div",{className:"fs-cta",children:[e.jsx("p",{className:"fs-cta__tagline fs-reveal",children:"The loop awaits."}),e.jsxs("h2",{className:"fs-cta__heading fs-reveal fs-delay-1",children:["Ready to enter",e.jsx("br",{}),"The Forbidden Space?"]}),e.jsxs("div",{className:"fs-cta__buttons fs-reveal fs-delay-2",children:[e.jsx("a",{href:"https://wubblyduby.itch.io/forbidden-space",target:"_blank",rel:"noopener noreferrer",className:"fs-btn-primary",children:"Play Free Now — itch.io ↗"}),e.jsx("a",{href:"/",className:"fs-btn-outline",children:"← Back to Portfolio"})]})]}),e.jsx("footer",{className:"fs-footer",children:e.jsxs("div",{className:"fs-footer__inner",children:[e.jsx("span",{className:"fs-footer__copy",children:"© 2026 Reno Febriyanto"}),e.jsx("div",{className:"fs-footer__links",children:[["GitHub","https://github.com/RenoFebriyanto"],["itch.io","https://catmounth.itch.io"],["LinkedIn","https://linkedin.com/in/renofebriyanto/"]].map(([s,d])=>e.jsx("a",{href:d,target:"_blank",rel:"noopener noreferrer",className:"fs-footer__link",children:s},s))})]})})]})}),o&&e.jsx(he,{src:o,onClose:()=>r(null)})]})]})}const A="projectenter",L="projectleave";function xe(n){return ne({panels:n,enterEvent:A,leaveEvent:L})}const ge="/models/Biograph.glb",be=.0025,P=.007,X=.88;function ve(){const n=g.useRef(null),o=g.useRef(null),r=g.useRef(!1),[l,m]=g.useState(!1);return g.useEffect(()=>{const a=n.current,c=o.current;if(!a||!c||r.current)return;r.current=!0;const v=a,s=c;let d=!1,i=null,f=null,h=null,t=null,u=null,w=null,j=!1,k={x:0,y:0},x={x:0,y:0};async function M(){const y=await Y(()=>import("./three.module-BX2Vlr8r.js"),[]);if(d)return;const{GLTFLoader:Z}=await Y(async()=>{const{GLTFLoader:p}=await import("./GLTFLoader-nBVbhmug.js");return{GLTFLoader:p}},__vite__mapDeps([0,1]));if(d)return;i=new y.WebGLRenderer({canvas:s,antialias:!0,alpha:!0}),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),i.setClearColor(0,0),i.outputColorSpace=y.SRGBColorSpace,i.toneMapping=y.ACESFilmicToneMapping,i.toneMappingExposure=1.15,f=new y.Scene,h=new y.PerspectiveCamera(35,1,.1,100),h.position.set(0,0,6),f.add(new y.AmbientLight(16777215,.55));const T=new y.DirectionalLight(16774112,1.6);T.position.set(3,4,3),f.add(T);const D=new y.DirectionalLight(8962303,.4);D.position.set(-3,-1,2),f.add(D);const F=new y.DirectionalLight(13209899,.5);F.position.set(0,1,-4),f.add(F);function U(){if(!i||!h)return;const p=v.clientWidth,N=v.clientHeight||p;i.setSize(p,N,!1),h.aspect=p/(N||1),h.updateProjectionMatrix()}w=new ResizeObserver(U),w.observe(v),U();function Q(p,N=1.4){const S=new y.Box3().setFromObject(p),z=S.getSize(new y.Vector3),R=Math.max(z.x,z.y,z.z);if(!isFinite(R)||R<=0)return;const ee=S.getCenter(new y.Vector3);p.position.sub(ee);const ae=h.fov*Math.PI/180,$=R/2/Math.tan(ae/2),se=$/h.aspect,C=N*Math.max($,se);h.position.set(0,0,C),h.near=C/100,h.far=C*100,h.updateProjectionMatrix()}new Z().load(ge,p=>{if(d)return;const N=p.scene;N.traverse(S=>{if(!S.isMesh||!S.material)return;const z=S.material;z.map&&(z.map.colorSpace=y.SRGBColorSpace),z.needsUpdate=!0}),Q(N),f.add(N),t=N,m(!0)},void 0,p=>{console.warn("[BiographViewer] GLB load failed:",p),m(!0)});function H(){d||(u=requestAnimationFrame(H),t&&(x.x*=X,x.y*=X,j||(Math.abs(x.y)<5e-4?t.rotation.y+=be:(t.rotation.y+=x.y,t.rotation.x+=x.x))),i.render(f,h))}H();const I=p=>{j=!0,k={x:p.clientX,y:p.clientY},x={x:0,y:0},s.style.cursor="grabbing"},O=p=>{!j||!t||(x.y=(p.clientX-k.x)*P,x.x=(p.clientY-k.y)*P,t.rotation.y+=x.y,t.rotation.x+=x.x,k={x:p.clientX,y:p.clientY})},G=()=>{j=!1,s.style.cursor="grab"};s.addEventListener("mousedown",I),window.addEventListener("mousemove",O),window.addEventListener("mouseup",G);let B={x:0,y:0};const J=p=>{j=!0,B={x:p.touches[0].clientX,y:p.touches[0].clientY},x={x:0,y:0}},W=p=>{!j||!t||(x.y=(p.touches[0].clientX-B.x)*P,x.x=(p.touches[0].clientY-B.y)*P,t.rotation.y+=x.y,t.rotation.x+=x.x,B={x:p.touches[0].clientX,y:p.touches[0].clientY})},q=()=>{j=!1};s.addEventListener("touchstart",J,{passive:!0}),s.addEventListener("touchmove",W,{passive:!0}),s.addEventListener("touchend",q),v.__bhCleanup=()=>{s.removeEventListener("mousedown",I),window.removeEventListener("mousemove",O),window.removeEventListener("mouseup",G),s.removeEventListener("touchstart",J),s.removeEventListener("touchmove",W),s.removeEventListener("touchend",q)}}return M(),()=>{d=!0,r.current=!1,u!==null&&cancelAnimationFrame(u),w?.disconnect(),v.__bhCleanup?.(),i&&(i.dispose(),i=null)}},[]),e.jsxs("div",{ref:n,className:"bh-viewer-canvas-wrap",children:[e.jsx("div",{className:"bh-viewer-grid","aria-hidden":"true"}),e.jsx("canvas",{ref:o,"aria-hidden":"true",style:{cursor:"grab"}}),e.jsx("div",{className:"bh-viewer-corner tl","aria-hidden":"true"}),e.jsx("div",{className:"bh-viewer-corner tr","aria-hidden":"true"}),e.jsx("div",{className:"bh-viewer-corner bl","aria-hidden":"true"}),e.jsx("div",{className:"bh-viewer-corner br","aria-hidden":"true"}),e.jsxs("div",{className:`bh-viewer-loading${l?" hidden":""}`,children:[e.jsx("div",{className:"bh-viewer-ring"}),e.jsx("span",{className:"bh-viewer-loading-text",children:"Loading model…"})]})]})}const K=[{id:"bh-hero",label:"Hero",scrollable:!1},{id:"bh-overview",label:"Overview",scrollable:!1},{id:"bh-gallery",label:"Gallery",scrollable:!0},{id:"bh-bts",label:"Process",scrollable:!0},{id:"bh-viewer",label:"3D View",scrollable:!0},{id:"bh-specs",label:"Specs",scrollable:!0}],b={eyebrow:"Case Study — 3D Art",titleLine1:"Biograph",titleLine2:"Horizon",sub:"A cinematic medical-equipment render exploring material studies, studio lighting, and procedural texturing — fully modeled and rendered in Blender Cycles.",heroImage:"/Assets/images/BiographHorizon.png",meta:[{label:"Year",value:"2025"},{label:"Software",value:"Blender / Cycles"},{label:"Role",value:"3D Artist"},{label:"Category",value:"Product / Hard Surface"}],overview:{heading:'A Study in <span class="gold">Light</span> &amp; Material.',text:"Biograph Horizon explores how studio-grade lighting and PBR material work can elevate a hard-surface medical scanner into something cinematic — built from reference, sculpted detail, and procedural texturing.",stats:[{num:4,suffix:"K",label:"Render Resolution"},{num:3,suffix:"",label:"Material Studies"},{num:6,suffix:"+",label:"Render Passes"},{num:1,suffix:"",label:"Final Hero Shot"}]},gallery:[{src:"/Assets/images/BiographHorizon.png",angle:"Front",desc:"Hero angle — primary render",size:"main"},{src:"/Assets/project/3d/Biograph/side-01.jpg",angle:"Side",desc:"Side profile study",size:"side"},{src:"/Assets/project/3d/Biograph/detail-01.jpg",angle:"Detail",desc:"Close-up panel detail",size:"side"}],wireframe:[{src:"/Assets/project/3d/Biograph/wireframe-01.jpg",angle:"Wireframe",desc:"Topology overview"},{src:"/Assets/project/3d/Biograph/clay-01.jpg",angle:"Clay Render",desc:"Clay / AO pass"}],specs:[{icon:"◆",title:"Modeling",rows:[{key:"Polygon Count",val:"TBD"},{key:"Topology",val:"Quad-based hard surface"},{key:"Modeling Method",val:"Box modeling + Boolean"}]},{icon:"✦",title:"Texturing",rows:[{key:"Texture Resolution",val:"TBD"},{key:"Material Count",val:"TBD"},{key:"Workflow",val:"Substance Painter → Cycles"}]},{icon:"◐",title:"Lighting",rows:[{key:"Render Engine",val:"Cycles"},{key:"Light Setup",val:"Studio 3-point + HDRI"},{key:"Samples",val:"TBD"}]},{icon:"▣",title:"Render",rows:[{key:"Resolution",val:"4K"},{key:"Render Time",val:"TBD"},{key:"Denoiser",val:"OptiX / OIDN"}]}],tools:[{name:"Blender",role:"Modeling & Render"},{name:"Cycles",role:"Render Engine"},{name:"Substance Painter",role:"Texturing"},{name:"Photoshop",role:"Post-Process"}],process:[{title:"Reference & Concept",desc:"Gathering reference imagery and breaking down the scanner’s form language before blocking."},{title:"Modeling & Topology",desc:"Hard-surface modeling with clean quad topology, prioritizing silhouette and panel detail."},{title:"Texturing & Materials",desc:"PBR material authoring in Substance Painter — metal, plastic, and glass studies."},{title:"Lighting & Render",desc:"Studio lighting setup in Cycles, fine-tuned for a clinical yet cinematic mood."}]};function E({id:n,scrollable:o=!1,onRegister:r,children:l}){const m=g.useRef(null);return g.useEffect(()=>(r(n,m.current),()=>r(n,null)),[n,r]),e.jsx("div",{ref:m,className:`bh-panel${o?" bh-panel--scroll":""}`,"data-panel-id":n,children:l})}function ue(){const n=g.useRef(null),{currentIdx:o,goTo:r,registerPanel:l}=xe(K);g.useEffect(()=>{const a=document.body,c=document.documentElement,v=a.style.overflow,s=c.style.height,d=c.style.overflow;return a.style.overflow="hidden",c.style.height="100%",c.style.overflow="hidden",()=>{a.style.overflow=v,c.style.height=s,c.style.overflow=d}},[]),g.useEffect(()=>{const a=document.title;return document.title="Biograph Horizon — Reno Febri",()=>{document.title=a}},[]),ie(()=>{const a=s=>{const{id:d}=s.detail,i=n.current?.querySelector(`[data-panel-id="${d}"]`);if(!i)return;if(document.querySelector(".bh-nav")?.classList.toggle("scrolled",d!=="bh-hero"),d==="bh-hero"){const h=i.querySelector(".bh-hero-parallax"),t=i.querySelector(".bh-hero-eyebrow"),u=Array.from(i.querySelectorAll(".bh-hero-title-line span")),w=i.querySelector(".bh-hero-sub"),j=i.querySelector(".bh-hero-meta"),k=i.querySelector(".bh-hero-scroll");h&&(_.killTweensOf(h),_.to(h,{yPercent:-4,duration:20,ease:"sine.inOut",yoyo:!0,repeat:-1}));const x=_.timeline({defaults:{ease:"power3.out"},delay:.1});t&&(_.set(t,{y:24,autoAlpha:0}),x.to(t,{y:0,autoAlpha:1,duration:.7})),u.length>0&&(i.querySelectorAll(".bh-hero-title-line").forEach(M=>{M.style.overflow="visible"}),_.set(u,{yPercent:105,autoAlpha:0}),x.to(u,{yPercent:0,autoAlpha:1,duration:.9,stagger:.14,onComplete:()=>{i.querySelectorAll(".bh-hero-title-line").forEach(M=>{M.style.overflow=""})}},"-=0.4")),w&&(_.set(w,{y:20,autoAlpha:0}),x.to(w,{y:0,autoAlpha:1,duration:.7},"-=0.5")),j&&(_.set(j,{y:16,autoAlpha:0}),x.to(j,{y:0,autoAlpha:1,duration:.65},"-=0.45")),k&&(_.set(k,{y:8,autoAlpha:0}),x.to(k,{y:0,autoAlpha:1,duration:.5,ease:"power2.out"},"-=0.2"));return}if(d==="bh-overview"){_.timeline({defaults:{ease:"power3.out"}}).from(i.querySelector(".bh-overview-text"),{y:32,autoAlpha:0,duration:.85}).from(i.querySelectorAll(".bh-stat"),{y:24,autoAlpha:0,duration:.65,stagger:.1},"-=0.5").call(()=>{i.querySelectorAll(".bh-stat-num").forEach(h=>{const t=parseFloat(h.dataset.val??"0"),u=h.dataset.suffix??"";if(isNaN(t))return;const w={val:0};_.to(w,{val:t,duration:1.4,ease:"power2.out",onUpdate(){h.textContent=`${Math.round(w.val)}${u}`}})})});return}const f=i.querySelectorAll(".bh-anim");f.length&&(_.set(f,{clearProps:"all"}),_.from(f,{y:28,autoAlpha:0,duration:.75,stagger:.1,ease:"power3.out",delay:.1}))},c=s=>{const{id:d}=s.detail;if(d==="bh-hero"){const i=n.current?.querySelector(`[data-panel-id="${d}"]`);if(i){const f=i.querySelector(".bh-hero-parallax");f&&_.killTweensOf(f)}}},v=setTimeout(()=>{window.dispatchEvent(new CustomEvent(A,{detail:{id:"bh-hero"}}))},80);return window.addEventListener(A,a),window.addEventListener(L,c),()=>{clearTimeout(v),window.removeEventListener(A,a),window.removeEventListener(L,c)}},{scope:n});const m=a=>{a.target.style.opacity="0"};return e.jsxs("div",{"data-page":"biograph-horizon",children:[e.jsxs("nav",{className:"bh-nav",children:[e.jsxs(V,{to:"/",className:"bh-nav-back",children:[e.jsx("span",{className:"bh-nav-back-arrow",children:"←"})," Back to Portfolio"]}),e.jsx("span",{className:"bh-nav-label",children:"3D Art / Case Study"})]}),e.jsx("nav",{className:"bh-dot-nav","aria-label":"Section navigation",children:K.map((a,c)=>e.jsx("button",{className:`bh-dot${c===o?" active":""}`,onClick:()=>r(c),title:a.label,"aria-label":`Go to ${a.label}`},a.id))}),e.jsxs("div",{className:"bh-page",ref:n,children:[e.jsx(E,{id:"bh-hero",onRegister:l,children:e.jsxs("section",{className:"bh-hero",children:[e.jsxs("div",{className:"bh-hero-parallax",children:[e.jsx("img",{src:b.heroImage,alt:"Biograph Horizon — full render",className:"bh-hero-bg",onError:m}),e.jsx("div",{className:"bh-hero-vignette","aria-hidden":"true"}),e.jsx("div",{className:"bh-hero-scanlines","aria-hidden":"true"})]}),e.jsxs("div",{className:"bh-hero-content",children:[e.jsxs("div",{className:"bh-hero-eyebrow",children:[e.jsx("span",{className:"bh-hero-eyebrow-line"}),e.jsx("span",{className:"bh-hero-eyebrow-text",children:b.eyebrow})]}),e.jsxs("h1",{className:"bh-hero-title",children:[e.jsx("span",{className:"bh-hero-title-line",children:e.jsx("span",{children:b.titleLine1})}),e.jsx("span",{className:"bh-hero-title-line",children:e.jsx("span",{className:"gold",children:b.titleLine2})})]}),e.jsx("p",{className:"bh-hero-sub",children:b.sub}),e.jsx("div",{className:"bh-hero-meta",children:b.meta.map((a,c)=>e.jsxs("div",{style:{display:"contents"},children:[c>0&&e.jsx("div",{className:"bh-meta-divider"}),e.jsxs("div",{className:"bh-meta-item",children:[e.jsx("span",{className:"bh-meta-label",children:a.label}),e.jsx("span",{className:"bh-meta-value",children:a.value})]})]},a.label))})]}),e.jsxs("div",{className:"bh-hero-scroll",role:"button",tabIndex:0,"aria-label":"Next section",onClick:()=>r(1),onKeyDown:a=>a.key==="Enter"&&r(1),children:[e.jsx("span",{className:"bh-hero-scroll-text",children:"Scroll"}),e.jsx("div",{className:"bh-hero-scroll-line"})]})]})}),e.jsx(E,{id:"bh-overview",onRegister:l,children:e.jsxs("section",{className:"bh-overview",children:[e.jsxs("div",{className:"bh-overview-text",children:[e.jsx("h2",{dangerouslySetInnerHTML:{__html:b.overview.heading}}),e.jsx("p",{children:b.overview.text})]}),e.jsx("div",{className:"bh-overview-stats",children:b.overview.stats.map(a=>e.jsxs("div",{className:"bh-stat",children:[e.jsxs("div",{className:"bh-stat-num","data-val":String(a.num),"data-suffix":a.suffix,children:[a.num,a.suffix]}),e.jsx("div",{className:"bh-stat-label",children:a.label})]},a.label))})]})}),e.jsx(E,{id:"bh-gallery",scrollable:!0,onRegister:l,children:e.jsxs("section",{className:"bh-gallery",children:[e.jsxs("div",{className:"bh-section-label bh-anim",children:[e.jsx("span",{className:"bh-section-num",children:"01"}),e.jsx("span",{className:"bh-section-line"}),e.jsx("span",{className:"bh-section-text",children:"Gallery"})]}),e.jsx("div",{className:"bh-gallery-grid",children:b.gallery.map(a=>e.jsxs("div",{className:`bh-gallery-item bh-gallery-item--${a.size} bh-anim`,children:[e.jsx("img",{src:a.src,alt:a.desc,loading:"lazy",draggable:!1,onError:m}),e.jsxs("div",{className:"bh-gallery-caption",children:[e.jsx("div",{className:"bh-gallery-caption-angle",children:a.angle}),e.jsx("div",{className:"bh-gallery-caption-desc",children:a.desc})]})]},a.src))})]})}),e.jsx(E,{id:"bh-bts",scrollable:!0,onRegister:l,children:e.jsxs("section",{className:"bh-gallery",children:[e.jsxs("div",{className:"bh-section-label bh-anim",children:[e.jsx("span",{className:"bh-section-num",children:"02"}),e.jsx("span",{className:"bh-section-line"}),e.jsx("span",{className:"bh-section-text",children:"Behind the Scenes"})]}),e.jsx("div",{className:"bh-gallery-grid",children:b.wireframe.map(a=>e.jsxs("div",{className:"bh-gallery-item bh-gallery-item--side bh-anim",children:[e.jsx("img",{src:a.src,alt:a.desc,loading:"lazy",draggable:!1,onError:m}),e.jsxs("div",{className:"bh-gallery-caption",children:[e.jsx("div",{className:"bh-gallery-caption-angle",children:a.angle}),e.jsx("div",{className:"bh-gallery-caption-desc",children:a.desc})]})]},a.src))})]})}),e.jsx(E,{id:"bh-viewer",scrollable:!0,onRegister:l,children:e.jsxs("section",{className:"bh-viewer",children:[e.jsxs("div",{className:"bh-viewer-header bh-anim",children:[e.jsxs("h2",{className:"bh-viewer-title",children:["Interactive ",e.jsx("span",{className:"gold",children:"3D Viewer"})]}),e.jsxs("div",{className:"bh-viewer-hint",children:[e.jsx("span",{className:"bh-viewer-hint-dot"}),"Drag to rotate"]})]}),e.jsx("div",{className:"bh-anim",children:e.jsx(ve,{})})]})}),e.jsxs(E,{id:"bh-specs",scrollable:!0,onRegister:l,children:[e.jsxs("section",{className:"bh-specs",children:[e.jsxs("div",{className:"bh-section-label bh-anim",children:[e.jsx("span",{className:"bh-section-num",children:"03"}),e.jsx("span",{className:"bh-section-line"}),e.jsx("span",{className:"bh-section-text",children:"Technical Breakdown"})]}),e.jsx("div",{className:"bh-specs-grid",children:b.specs.map(a=>e.jsxs("div",{className:"bh-spec-block bh-anim",children:[e.jsx("div",{className:"bh-spec-icon",children:a.icon}),e.jsx("div",{className:"bh-spec-title",children:a.title}),e.jsx("div",{className:"bh-spec-rows",children:a.rows.map(c=>e.jsxs("div",{className:"bh-spec-row",children:[e.jsx("span",{className:"bh-spec-key",children:c.key}),e.jsx("span",{className:`bh-spec-val${c.val==="TBD"?" gold":""}`,children:c.val})]},c.key))})]},a.title))})]}),e.jsxs("section",{className:"bh-tools",children:[e.jsxs("div",{className:"bh-section-label bh-anim",children:[e.jsx("span",{className:"bh-section-num",children:"04"}),e.jsx("span",{className:"bh-section-line"}),e.jsx("span",{className:"bh-section-text",children:"Tools Used"})]}),e.jsx("div",{className:"bh-tools-grid",children:b.tools.map(a=>e.jsxs("div",{className:"bh-tool-chip bh-anim",children:[e.jsx("span",{className:"bh-tool-chip-dot"}),e.jsx("span",{className:"bh-tool-name",children:a.name}),e.jsx("span",{className:"bh-tool-chip-divider"}),e.jsx("span",{className:"bh-tool-role",children:a.role})]},a.name))})]}),e.jsxs("section",{className:"bh-process",children:[e.jsxs("div",{className:"bh-section-label bh-anim",children:[e.jsx("span",{className:"bh-section-num",children:"05"}),e.jsx("span",{className:"bh-section-line"}),e.jsx("span",{className:"bh-section-text",children:"Process"})]}),e.jsx("div",{className:"bh-process-steps",children:b.process.map((a,c)=>e.jsxs("div",{className:"bh-step bh-anim",children:[e.jsx("span",{className:"bh-step-num",children:String(c+1).padStart(2,"0")}),e.jsx("div",{className:"bh-step-title",children:a.title}),e.jsx("p",{className:"bh-step-desc",children:a.desc})]},a.title))})]}),e.jsxs("footer",{className:"bh-footer bh-anim",children:[e.jsxs("p",{className:"bh-footer-copy",children:["© ",new Date().getFullYear()," Reno Febri —"," ",e.jsx("span",{children:"Biograph Horizon"})]}),e.jsx(V,{to:"/",className:"bh-back-btn",children:"← Back to Portfolio"})]})]})]})]})}const ye={"forbidden-space":me,biographhorizon:ue},we=re(function(){const{slug:o}=te(),r=oe.find(m=>m.slug===o);if(!r)return e.jsxs("div",{style:{padding:"120px 40px",textAlign:"center",fontFamily:"var(--font-mono)"},children:[e.jsx("p",{style:{color:"var(--text-muted)",fontSize:"0.8rem",letterSpacing:"0.1em"},children:"PROJECT NOT FOUND"}),e.jsx("a",{href:"/",style:{color:"var(--accent-primary)",marginTop:"24px",display:"inline-block"},children:"← Back to Portfolio"})]});const l=o?ye[o]:void 0;return l?e.jsx(l,{}):e.jsxs("div",{style:{padding:"120px 40px 60px",maxWidth:"800px",margin:"0 auto"},children:[e.jsx("a",{href:"/",style:{fontFamily:"var(--font-mono)",fontSize:"0.75rem",letterSpacing:"0.08em",color:"var(--color-text-muted)",display:"flex",alignItems:"center",gap:"8px",marginBottom:"40px",transition:"color 0.2s"},children:"← Back to Portfolio"}),e.jsx("p",{style:{fontFamily:"var(--font-mono)",fontSize:"0.7rem",letterSpacing:"0.12em",color:"var(--accent-primary)",marginBottom:"12px"},children:r.categoryLabel.toUpperCase()}),e.jsx("h1",{style:{fontFamily:"var(--font-display)",fontSize:"clamp(3rem, 8vw, 6rem)",fontWeight:800,textTransform:"uppercase",lineHeight:.95,marginBottom:"32px",color:"var(--text-primary)"},children:r.title}),e.jsx("p",{style:{fontSize:"1.1rem",fontWeight:300,lineHeight:1.75,color:"var(--text-secondary)",marginBottom:"40px"},children:r.description}),e.jsx("div",{style:{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"48px"},children:r.tags.map(m=>e.jsx("span",{style:{fontFamily:"var(--font-mono)",fontSize:"0.7rem",letterSpacing:"0.08em",color:"var(--color-text-muted)",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",padding:"4px 12px",borderRadius:"3px"},children:m},m))}),e.jsxs("div",{style:{display:"flex",gap:"16px",flexWrap:"wrap"},children:[r.link&&e.jsx("a",{href:r.link,target:"_blank",rel:"noopener noreferrer",className:"btn-primary",children:"View Project ↗"}),r.itchLink&&e.jsx("a",{href:r.itchLink,target:"_blank",rel:"noopener noreferrer",className:"btn-primary",children:"Play on itch.io ↗"}),r.githubLink&&e.jsx("a",{href:r.githubLink,target:"_blank",rel:"noopener noreferrer",className:"btn-secondary",children:"GitHub →"})]})]})});export{we as default};
