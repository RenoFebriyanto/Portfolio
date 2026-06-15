import { useCallback, useEffect } from 'react';
import { Hero }     from '~/components/sections/Hero';
import { About }    from '~/components/sections/About';
import { Projects } from '~/components/sections/Projects';
import { Skills }   from '~/components/sections/Skills';
import { Contact }  from '~/components/sections/Contact';
import { SnapPanel } from '~/components/ui/SnapPanel';
import { DotNav }   from '~/components/ui/DotNav';
import { usePageSnap }         from '~/hooks/usePageSnap';
import { useSectionAnimations } from '~/hooks/useSectionAnimations';

export default function Index() {
  const { currentIdx, sections, goTo, registerPanel } = usePageSnap();

  // Port of section-animations.js
  useSectionAnimations();

  // Expose PageNav global for back-to-top button etc.
  useEffect(() => {
    (window as unknown as Record<string, unknown>).PageNav = {
      goTo,
      next: () => goTo(currentIdx + 1, 'next'),
      prev: () => goTo(currentIdx - 1, 'prev'),
      getIndex: () => currentIdx,
    };
  }, [currentIdx, goTo]);

  // Nav link override — anchor clicks → snap
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const handlers = new Map<HTMLAnchorElement, (e: Event) => void>();

    links.forEach(link => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      const idx = sections.findIndex(s => s.id === targetId);
      if (idx === -1) return;
      const handler = (e: Event) => {
        e.preventDefault();
        goTo(idx, idx > currentIdx ? 'next' : 'prev');
      };
      link.addEventListener('click', handler);
      handlers.set(link, handler);
    });

    return () => {
      handlers.forEach((handler, link) => link.removeEventListener('click', handler));
    };
  }, [sections, goTo, currentIdx]);

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    // Expose container ref to Hero for parallax ghost
    if (el) (window as unknown as Record<string, unknown>).__scrollContainer = el;
  }, []);

  return (
    <>
      {/* Background layers */}
      <div className="bg-grid" aria-hidden />
      <div className="bg-glow-top" aria-hidden />

      {/* Scroll container */}
      <div id="scroll-container" ref={containerRef}>

        <SnapPanel
          id="hero"
          scrollable={false}
          isVisible={currentIdx === 0}
          onRegister={registerPanel}
        >
          <Hero
            scrollTo={goTo}
            containerRef={{ current: null }}
          />
        </SnapPanel>

        <SnapPanel
          id="about"
          scrollable
          isVisible={currentIdx === 1}
          onRegister={registerPanel}
        >
          <About />
        </SnapPanel>

        <SnapPanel
          id="projects"
          scrollable
          isVisible={currentIdx === 2}
          onRegister={registerPanel}
        >
          <Projects />
        </SnapPanel>

        <SnapPanel
          id="skills"
          scrollable
          isVisible={currentIdx === 3}
          onRegister={registerPanel}
        >
          <Skills />
        </SnapPanel>

        <SnapPanel
          id="contact"
          scrollable
          isVisible={currentIdx === 4}
          onRegister={registerPanel}
        >
          <Contact />
        </SnapPanel>

      </div>

      {/* Dot navigation */}
      <DotNav
        sections={sections}
        currentIdx={currentIdx}
        onNavigate={goTo}
      />
    </>
  );
}
