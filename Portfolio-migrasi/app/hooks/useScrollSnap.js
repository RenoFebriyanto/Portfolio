import { useEffect, useRef, useState } from 'react';
export function useScrollSnap(sectionCount) {
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const sections = Array.from(container.querySelectorAll('.section'));
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = sections.indexOf(entry.target);
                    if (idx !== -1)
                        setActiveIndex(idx);
                }
            });
        }, { root: container, threshold: 0.5 });
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, [sectionCount]);
    const scrollTo = (index) => {
        const container = containerRef.current;
        if (!container)
            return;
        const sections = container.querySelectorAll('.section');
        sections[index]?.scrollIntoView({ behavior: 'smooth' });
    };
    return { containerRef, activeIndex, scrollTo };
}
