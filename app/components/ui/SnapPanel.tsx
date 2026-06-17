import { useEffect, useRef } from 'react';

interface SnapPanelProps {
  id:         string;
  scrollable?: boolean;
  onRegister: (id: string, el: HTMLElement | null) => void;
  children:   React.ReactNode;
}

/**
 * SnapPanel — wrapper per section.
 * 
 * PENTING: Komponen ini TIDAK menerima prop isVisible.
 * Visibility (opacity, pointerEvents, transform) sepenuhnya dikontrol
 * oleh usePageSnap via direct DOM manipulation agar tidak bentrok dengan
 * React re-render cycle.
 * 
 * Initial state diset via data-panel-id dan CSS di snap.css:
 *   [data-panel-id]:not([data-visible="true"]) { opacity: 0; pointer-events: none; }
 */
export function SnapPanel({ id, scrollable = false, onRegister, children }: SnapPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onRegister(id, ref.current);
    return () => onRegister(id, null);
  }, [id, onRegister]);

  return (
    <div
      ref={ref}
      className={`snap-panel${scrollable ? ' snap-panel--scroll' : ''}`}
      data-panel-id={id}
    >
      {children}
    </div>
  );
}