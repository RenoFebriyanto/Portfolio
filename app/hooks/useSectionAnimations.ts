import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '~/utils/gsap';

export function useSectionAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const registrations = new Map<HTMLElement, gsap.core.Animation[]>();

    const registerReveal = (element: HTMLElement) => {
      if (registrations.has(element)) return;

      if (reducedMotion) {
        gsap.set(element, { clearProps: 'all', autoAlpha: 1, y: 0, scale: 1 });
        element.classList.add('visible');
        registrations.set(element, []);
        return;
      }

      const animations: gsap.core.Animation[] = [];
      element.classList.add('scroll-reveal-driven');
      const animation = gsap.fromTo(
        element,
        { autoAlpha: 0, y: 28, scale: element.classList.contains('project-card') ? 1 : 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            end: 'top 52%',
            scrub: true,
            onUpdate: self => {
              const active = self.progress > 0.55;
              if (element.classList.contains('skill-group')) {
                element.classList.toggle('visible', active);
              }
              if (element.classList.contains('section-label')) {
                element.classList.toggle('visible', active);
              }
              if (element.classList.contains('section-divider')) {
                element.classList.toggle('line-drawn', active);
              }
            },
          },
        },
      );
      animations.push(animation);

      if (element.classList.contains('skill-group')) {
        element.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach(fill => {
          const barAnimation = gsap.fromTo(
            fill,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                end: 'top 48%',
                scrub: true,
              },
            },
          );
          animations.push(barAnimation);
        });
      }
      registrations.set(element, animations);
    };

    const registerTree = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.matches('.reveal')) registerReveal(node);
      node.querySelectorAll<HTMLElement>('.reveal').forEach(registerReveal);
    };

    const unregisterTree = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      const elements = [
        ...(node.matches('.reveal') ? [node] : []),
        ...node.querySelectorAll<HTMLElement>('.reveal'),
      ];
      elements.forEach(element => {
        registrations.get(element)?.forEach(animation => {
          animation.scrollTrigger?.kill();
          animation.kill();
        });
        registrations.delete(element);
      });
    };

    document.querySelectorAll<HTMLElement>('.reveal').forEach(registerReveal);

    const mutationObserver = new MutationObserver(records => {
      records.forEach(record => {
        record.removedNodes.forEach(unregisterTree);
        record.addedNodes.forEach(registerTree);
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const contact = document.querySelector<HTMLElement>('#contact .contact-eyebrow');
    let typingTimer: ReturnType<typeof setTimeout> | null = null;
    let contactTrigger: ScrollTrigger | null = null;
    if (contact && !reducedMotion) {
      const fullText = contact.textContent?.trim() ?? '';
      contact.dataset.fullText = fullText;
      contactTrigger = ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          contact.textContent = '';
          contact.classList.add('motion-typed');
          let charIndex = 0;
          const typeNext = () => {
            if (charIndex < fullText.length) {
              contact.textContent = fullText.slice(0, ++charIndex);
              typingTimer = setTimeout(typeNext, 38 + Math.random() * 22);
            } else {
              typingTimer = setTimeout(() => contact.classList.remove('motion-typed'), 1800);
            }
          };
          typeNext();
        },
      });
    }

    return () => {
      mutationObserver.disconnect();
      registrations.forEach(animations => animations.forEach(animation => {
        animation.scrollTrigger?.kill();
        animation.kill();
      }));
      registrations.clear();
      contactTrigger?.kill();
      if (typingTimer) clearTimeout(typingTimer);
      ScrollTrigger.refresh();
    };
  }, []);
}
