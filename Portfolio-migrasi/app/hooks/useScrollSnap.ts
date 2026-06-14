import { useEffect, useRef } from "react";

export function useScrollSnap(enabled = true) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = document.querySelector(".scroll-container") as HTMLElement;
    if (!container) return;
    containerRef.current = container;

    // Snap behavior dihandle via CSS scroll-snap
    // Hook ini bisa diperluas untuk scroll index tracking nanti
    const sections = container.querySelectorAll<HTMLElement>(".section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) {
              window.history.replaceState(null, "", `#${id}`);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [enabled]);

  return containerRef;
}