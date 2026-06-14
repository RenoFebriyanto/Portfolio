import { useEffect, useRef } from "react";

interface CursorProps {
  position: { x: number; y: number };
  variant: "default" | "hover" | "hidden";
}

export default function Cursor({ position, variant }: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    dot.style.transform = `translate(${position.x}px, ${position.y}px)`;

    // Ring follows with slight lag via CSS transition
    ring.style.transform = `translate(${position.x}px, ${position.y}px)`;
  }, [position]);

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor__dot cursor__dot--${variant}`}
      />
      <div
        ref={ringRef}
        className={`cursor__ring cursor__ring--${variant}`}
      />
    </>
  );
}