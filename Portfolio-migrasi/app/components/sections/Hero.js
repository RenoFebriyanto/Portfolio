import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { HeroCanvas } from '~/components/three/HeroCanvas';
export function Hero({ scrollTo, containerRef }) {
    const ghostRef = useRef(null);
    // Ghost parallax
    useEffect(() => {
        const container = containerRef.current;
        const ghost = ghostRef.current;
        if (!container || !ghost)
            return;
        const handler = () => {
            const y = container.scrollTop;
            ghost.style.transform = `translateX(-50%) translateY(${y * 0.25}px)`;
        };
        container.addEventListener('scroll', handler, { passive: true });
        return () => container.removeEventListener('scroll', handler);
    }, [containerRef]);
    return (_jsxs("section", { className: "section hero", id: "hero", children: [_jsx(HeroCanvas, { className: "hero__canvas" }), _jsx("span", { className: "hero__ghost", ref: ghostRef, "aria-hidden": true, children: "RENO" }), _jsxs("div", { className: "hero__content", children: [_jsx("p", { className: "hero__eyebrow", children: "Game Tech \u00B7 3D \u00B7 Interactive Web" }), _jsxs("h1", { className: "hero__title", children: ["Reno", _jsx("span", { className: "hero__title-accent", children: "Febriyanto" })] }), _jsx("p", { className: "hero__subtitle", children: "Developer & creator focused on game technology, 3D art, and premium interactive experiences." }), _jsxs("div", { className: "hero__cta-row", children: [_jsx("button", { className: "hero__btn hero__btn--primary", onClick: () => scrollTo(2), children: "View Projects" }), _jsx("button", { className: "hero__btn hero__btn--outline", onClick: () => scrollTo(4), children: "Get In Touch" })] })] }), _jsxs("div", { className: "hero__scroll-hint", "aria-hidden": true, children: [_jsx("span", { children: "Scroll" }), _jsx("div", { className: "hero__scroll-line" })] })] }));
}
