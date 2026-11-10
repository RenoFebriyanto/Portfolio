import { useCallback, useEffect, useRef, useState } from 'react';
import { Hero }     from '~/components/sections/Hero';
import { About }    from '~/components/sections/About';
import { Projects } from '~/components/sections/Projects';
import { Skills }   from '~/components/sections/Skills';
import { Contact }  from '~/components/sections/Contact';
import { DotNav }   from '~/components/ui/DotNav';
import { useSectionAnimations } from '~/hooks/useSectionAnimations';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function Index() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentIdxRef = useRef(0);
  const previousScrollY = useRef(0);

  useSectionAnimations();

  const goTo = useCallback((index: number, _direction?: 'next' | 'prev') => {
    const section = SECTIONS[index];
    if (!section) return;

    document.getElementById(section.id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const marker = window.innerHeight * 0.42;
      const index = SECTIONS.reduce((activeIndex, section, sectionIndex) => {
        const element = document.getElementById(section.id);
        if (!element) return activeIndex;
        const rect = element.getBoundingClientRect();
        return rect.top <= marker && rect.bottom > marker ? sectionIndex : activeIndex;
      }, 0);

      if (index === currentIdxRef.current) return;

      const previous = SECTIONS[currentIdxRef.current];
      const current = SECTIONS[index];
      const direction = window.scrollY >= previousScrollY.current ? 'next' : 'prev';
      previousScrollY.current = window.scrollY;
      window.dispatchEvent(new CustomEvent('sectionleave', {
        detail: { id: previous.id, direction },
      }));
      currentIdxRef.current = index;
      setCurrentIdx(index);
      window.dispatchEvent(new CustomEvent('sectionenter', {
        detail: { id: current.id, direction },
      }));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    previousScrollY.current = window.scrollY;
    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    (window as unknown as Record<string, unknown>).PageNav = {
      goTo,
      next: () => goTo(currentIdx + 1, 'next'),
      prev: () => goTo(currentIdx - 1, 'prev'),
      getIndex: () => currentIdx,
    };
  }, [currentIdx, goTo]);

  return (
    <>
      {/* Background layers */}
      <div className="bg-grid" aria-hidden />
      <div className="bg-glow-top" aria-hidden />

      <main id="portfolio-content">
        <Hero scrollTo={goTo} />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Dot navigation kanan layar */}
      <DotNav
        sections={SECTIONS}
        currentIdx={currentIdx}
        onNavigate={goTo}
      />
    </>
  );
}