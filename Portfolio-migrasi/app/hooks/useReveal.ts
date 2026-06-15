import { useEffect, useRef } from 'react';

/**
 * Watches .reveal elements inside `root` (defaults to document if null)
 * and adds .revealed when they enter the viewport.
 * Returns a ref to attach to the scroll container.
 */
export function useReveal(rootRef?: React.RefObject<HTMLElement | null>) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const root = rootRef?.current ?? null;

    const targets = (root ?? document).querySelectorAll<HTMLElement>(
      '.reveal, .reveal-stagger, .reveal-fade'
    );

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        root,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    targets.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [rootRef]);
}
