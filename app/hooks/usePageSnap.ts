import { useSnapNavigation, type SnapPanelDef } from './useSnapNavigation';

export interface SectionDef extends SnapPanelDef {}

const SECTIONS: SectionDef[] = [
  { id: 'hero',     label: 'Home',    scrollable: false },
  { id: 'about',    label: 'About',   scrollable: true  },
  { id: 'projects', label: 'Work',    scrollable: true  },
  { id: 'skills',   label: 'Skills',  scrollable: true  },
  { id: 'contact',  label: 'Contact', scrollable: true  },
];

export function usePageSnap() {
  const snap = useSnapNavigation({ panels: SECTIONS });
  return { ...snap, sections: SECTIONS };
}