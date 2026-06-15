import { useEffect, useRef } from 'react';

interface SnapPanelProps {
  id:         string;
  scrollable?: boolean;
  isVisible:  boolean;
  onRegister: (id: string, el: HTMLElement | null) => void;
  children:   React.ReactNode;
}

export function SnapPanel({ id, scrollable = false, isVisible, onRegister, children }: SnapPanelProps) {
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
      data-visible={isVisible ? 'true' : 'false'}
      style={{
        position:      'fixed',
        inset:         '0',
        width:         '100%',
        height:        '100%',
        opacity:       isVisible ? '1' : '0',
        pointerEvents: isVisible ? 'auto' : 'none',
        overflowY:     scrollable ? 'auto' : 'hidden',
        overflowX:     'hidden',
        zIndex:        isVisible ? 10 : 0,
        willChange:    'transform, opacity',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
