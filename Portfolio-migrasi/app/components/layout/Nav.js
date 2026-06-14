import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const NAV_LINKS = [
    { label: 'About', index: 1 },
    { label: 'Projects', index: 2 },
    { label: 'Skills', index: 3 },
    { label: 'Contact', index: 4 },
];
export function Nav({ activeIndex, scrollTo }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const container = document.getElementById('scroll-container');
        if (!container)
            return;
        const handler = () => setScrolled(container.scrollTop > 40);
        container.addEventListener('scroll', handler, { passive: true });
        return () => container.removeEventListener('scroll', handler);
    }, []);
    return (_jsx("nav", { className: `nav${scrolled ? ' scrolled' : ''}`, children: _jsxs("div", { className: "nav__inner container", children: [_jsxs("button", { className: "nav__logo", onClick: () => scrollTo(0), children: ["RF", _jsx("span", { className: "nav__logo-dot" })] }), _jsx("ul", { className: "nav__links", children: NAV_LINKS.map(({ label, index }) => (_jsx("li", { children: _jsx("button", { className: `nav__link${activeIndex === index ? ' active' : ''}`, onClick: () => scrollTo(index), children: label }) }, label))) }), _jsx("button", { className: "nav__cta", onClick: () => scrollTo(4), children: "Hire Me" })] }) }));
}
