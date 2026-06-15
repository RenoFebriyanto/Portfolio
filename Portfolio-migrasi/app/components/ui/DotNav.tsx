import type { SectionDef } from '~/hooks/usePageSnap';

interface DotNavProps {
  sections:   SectionDef[];
  currentIdx: number;
  onNavigate: (idx: number) => void;
}

export function DotNav({ sections, currentIdx, onNavigate }: DotNavProps) {
  return (
    <nav className="snap-dots" aria-label="Page navigation">
      {sections.map((sec, i) => (
        <button
          key={sec.id}
          className={`snap-dot${i === currentIdx ? ' active' : ''}`}
          aria-label={`Go to ${sec.label}`}
          title={sec.label}
          onClick={() => onNavigate(i)}
        />
      ))}
    </nav>
  );
}
