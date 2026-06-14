import { useEffect, useRef, useState } from 'react';

export function useScrollSnap(sectionCount: number) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>('.section')
    );

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [sectionCount]);

  const scrollTo = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll<HTMLElement>('.section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return { containerRef, activeIndex, scrollTo };
}