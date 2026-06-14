import { useEffect } from 'react';
/**
 * Watches .reveal, .reveal-stagger, .reveal-fade elements
 * inside the given scroll container and adds .revealed when visible.
 */
export function useScrollReveal(containerRef) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const targets = container.querySelectorAll('.reveal, .reveal-stagger, .reveal-fade');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: container, threshold: 0.15 });
        targets.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [containerRef]);
}
