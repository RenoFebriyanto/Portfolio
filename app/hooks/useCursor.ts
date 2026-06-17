import { useState, useEffect, useCallback } from "react";

type CursorVariant = "default" | "hover" | "hidden";

export function useCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");

  const onMouseMove = useCallback((e: MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const onMouseEnterLink = useCallback(() => setCursorVariant("hover"), []);
  const onMouseLeaveLink = useCallback(() => setCursorVariant("default"), []);
  const onMouseLeaveWindow = useCallback(() => setCursorVariant("hidden"), []);
  const onMouseEnterWindow = useCallback(() => setCursorVariant("default"), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveWindow);
    document.addEventListener("mouseenter", onMouseEnterWindow);

    const addHoverListeners = () => {
      document
        .querySelectorAll("a, button, [data-cursor='hover']")
        .forEach((el) => {
          el.addEventListener("mouseenter", onMouseEnterLink);
          el.addEventListener("mouseleave", onMouseLeaveLink);
        });
    };

    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
      observer.disconnect();
    };
  }, [onMouseMove, onMouseEnterLink, onMouseLeaveLink, onMouseLeaveWindow, onMouseEnterWindow]);

  return { cursorPos, cursorVariant };
}