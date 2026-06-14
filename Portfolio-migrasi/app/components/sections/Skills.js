import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
const SKILL_CATEGORIES = [
    {
        title: 'Game Development',
        skills: [
            { name: 'Unity', level: 85 },
            { name: 'C#', level: 80 },
            { name: 'Godot', level: 65 },
            { name: 'Game Design', level: 75 },
        ],
    },
    {
        title: '3D & Visual',
        skills: [
            { name: 'Blender', level: 88 },
            { name: 'GLSL Shaders', level: 55 },
            { name: 'Three.js', level: 72 },
            { name: 'glTF / GLB', level: 78 },
        ],
    },
    {
        title: 'Web & Code',
        skills: [
            { name: 'HTML / CSS', level: 85 },
            { name: 'JavaScript', level: 78 },
            { name: 'React', level: 70 },
            { name: 'TypeScript', level: 60 },
        ],
    },
    {
        title: 'Tools & Pipeline',
        skills: [
            { name: 'Git / GitHub', level: 80 },
            { name: 'GSAP', level: 68 },
            { name: 'Figma', level: 65 },
            { name: 'Vercel / Deploy', level: 72 },
        ],
    },
];
export function Skills() {
    const sectionRef = useRef(null);
    // Animate bars when section enters viewport
    useEffect(() => {
        const section = sectionRef.current;
        if (!section)
            return;
        const bars = section.querySelectorAll('.skill-item__bar');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bars.forEach(bar => bar.classList.add('animated'));
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(section);
        return () => observer.disconnect();
    }, []);
    return (_jsx("section", { className: "section scrollable skills", id: "skills", ref: sectionRef, children: _jsx("div", { className: "container", children: _jsxs("div", { className: "skills__inner", children: [_jsxs("div", { className: "reveal", children: [_jsx("p", { className: "section-label", children: "03 \u2014 Expertise" }), _jsx("h2", { className: "section-heading", children: "Skills" })] }), _jsx("div", { className: "skills__grid", children: SKILL_CATEGORIES.map(cat => (_jsxs("div", { className: "skills__category reveal", children: [_jsx("p", { className: "skills__category-title", children: cat.title }), _jsx("div", { className: "skills__list", children: cat.skills.map(skill => (_jsxs("div", { className: "skill-item", children: [_jsxs("div", { className: "skill-item__header", children: [_jsx("span", { className: "skill-item__name", children: skill.name }), _jsxs("span", { className: "skill-item__value", children: [skill.level, "%"] })] }), _jsx("div", { className: "skill-item__track", children: _jsx("div", { className: "skill-item__bar", style: { '--skill-level': `${skill.level}%` } }) })] }, skill.name))) })] }, cat.title))) })] }) }) }));
}
