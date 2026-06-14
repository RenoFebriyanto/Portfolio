import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const TECH_STACK = [
    { icon: '🎮', name: 'Unity', level: '85%' },
    { icon: '🟦', name: 'Godot', level: '65%' },
    { icon: '🧊', name: 'Blender', level: '88%' },
    { icon: '#', name: 'C#', level: '80%' },
    { icon: '⚡', name: 'JavaScript', level: '78%' },
    { icon: '🌐', name: 'HTML / CSS', level: '85%' },
    { icon: '◈', name: 'GLSL', level: '55%' },
    { icon: '⬛', name: 'Three.js', level: '72%' },
];
const LEARNING = ['Unreal Engine 5', 'TypeScript', 'WebGPU', 'Houdini FX'];
const SOCIAL_LINKS = [
    { label: 'GitHub', href: 'https://github.com/RenoFebriyanto' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/renofebriyanto/' },
    { label: 'itch.io', href: 'https://catmounth.itch.io' },
    { label: 'Instagram', href: 'https://instagram.com/norigaken' },
];
export function About() {
    return (_jsx("section", { className: "section about", id: "about", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "about__inner", children: [_jsxs("div", { className: "about__text reveal", children: [_jsx("p", { className: "section-label", children: "01 \u2014 About" }), _jsx("h2", { className: "section-heading", children: "Who I Am" }), _jsxs("p", { className: "about__body", children: ["I'm a ", _jsx("strong", { children: "Game Tech & 3D Creator" }), " based in Indonesia, passionate about building immersive interactive experiences \u2014 from game mechanics and 3D art to shader experiments and creative web technology."] }), _jsxs("p", { className: "about__body", children: ["I work across the full pipeline: ", _jsx("strong", { children: "design, develop, and ship" }), ". Whether it's a Unity game, a Blender render, or a WebGL experiment, I care about craft, performance, and visual quality."] }), _jsxs("div", { className: "about__stats", children: [_jsxs("div", { children: [_jsx("span", { className: "about__stat-value", children: "3+" }), _jsx("span", { className: "about__stat-label", children: "Years Experience" })] }), _jsxs("div", { children: [_jsx("span", { className: "about__stat-value", children: "10+" }), _jsx("span", { className: "about__stat-label", children: "Projects Shipped" })] }), _jsxs("div", { children: [_jsx("span", { className: "about__stat-value", children: "4" }), _jsx("span", { className: "about__stat-label", children: "Disciplines" })] })] }), _jsx("div", { className: "about__links", children: SOCIAL_LINKS.map(link => (_jsx("a", { className: "about__link", href: link.href, target: "_blank", rel: "noreferrer", children: link.label }, link.label))) })] }), _jsx("div", { className: "about__visual reveal", children: _jsxs("div", { className: "about__card", children: [_jsx("div", { className: "about__tech-grid", children: TECH_STACK.map(t => (_jsxs("div", { className: "about__tech-item", children: [_jsx("span", { className: "about__tech-icon", children: t.icon }), _jsx("span", { className: "about__tech-name", children: t.name }), _jsx("span", { className: "about__tech-level", children: t.level })] }, t.name))) }), _jsxs("div", { className: "about__learning", children: [_jsx("p", { className: "about__learning-label", children: "Currently Learning" }), _jsx("div", { className: "about__learning-tags", children: LEARNING.map(l => (_jsx("span", { className: "about__tag", children: l }, l))) })] })] }) })] }) }) }));
}
