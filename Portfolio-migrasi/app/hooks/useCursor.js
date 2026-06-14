import { useEffect } from 'react';
/**
 * Custom ring+dot cursor controller.
 *
 * States (mirrors the old vanilla `cursor.css` body classes, applied to the
 * ring/dot elements directly since we don't want to thrash document.body
 * across React re-renders):
 *  - default: small dot + dim ring
 *  - .hovered: links, buttons, nav items, form fields -> ring grows + fills
 *  - .card:    project cards / skill groups / stat cards -> larger, dimmer ring
 *  - .hidden:  mouse left viewport
 */
export function useCursor() {
    useEffect(() => {
        // Bail on touch devices
        if (window.matchMedia('(pointer: coarse)').matches)
            return;
        const ring = document.querySelector('.cursor-ring');
        const dot = document.querySelector('.cursor-dot');
        if (!ring || !dot)
            return;
        let mx = 0, my = 0; // real mouse
        let rx = 0, ry = 0; // ring lerp
        let raf;
        const onMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = `${mx}px`;
            dot.style.top = `${my}px`;
            ring.classList.remove('hidden');
            dot.classList.remove('hidden');
        };
        const onLeave = () => {
            ring.classList.add('hidden');
            dot.classList.add('hidden');
        };
        const onEnter = () => {
            ring.classList.remove('hidden');
            dot.classList.remove('hidden');
        };
        const onHoverIn = () => {
            ring.classList.add('hovered');
            dot.classList.add('hovered');
        };
        const onHoverOut = () => {
            ring.classList.remove('hovered');
            dot.classList.remove('hovered');
        };
        const onCardIn = () => ring.classList.add('card');
        const onCardOut = () => ring.classList.remove('card');
        const tick = () => {
            raf = requestAnimationFrame(tick);
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = `${rx}px`;
            ring.style.top = `${ry}px`;
        };
        // Interactive elements: anything that should "fill" the ring
        const INTERACTIVE = 'a, button, input, textarea, label, [data-hover], .filter-btn, .nav__cta, .nav__link, .social-link';
        // Cards: larger dim ring, no fill
        const CARDS = '.project-card, .skill-item, .about__tech-item, .stat-item';
        const tracked = new Set();
        const attachHover = () => {
            document.querySelectorAll(INTERACTIVE).forEach((el) => {
                if (tracked.has(el))
                    return;
                tracked.add(el);
                el.addEventListener('mouseenter', onHoverIn);
                el.addEventListener('mouseleave', onHoverOut);
            });
            document.querySelectorAll(CARDS).forEach((el) => {
                if (tracked.has(el))
                    return;
                tracked.add(el);
                el.addEventListener('mouseenter', onCardIn);
                el.addEventListener('mouseleave', onCardOut);
            });
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);
        tick();
        attachHover();
        // Re-attach when DOM changes (dynamically rendered project cards, etc.)
        const mo = new MutationObserver(attachHover);
        mo.observe(document.body, { childList: true, subtree: true });
        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            mo.disconnect();
            tracked.forEach((el) => {
                el.removeEventListener('mouseenter', onHoverIn);
                el.removeEventListener('mouseleave', onHoverOut);
                el.removeEventListener('mouseenter', onCardIn);
                el.removeEventListener('mouseleave', onCardOut);
            });
        };
    }, []);
}
