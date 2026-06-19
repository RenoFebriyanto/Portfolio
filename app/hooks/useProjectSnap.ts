import { useSnapNavigation, type SnapPanelDef } from './useSnapNavigation';

export type ProjectPanel = SnapPanelDef;

export const PROJECT_ENTER = 'projectenter';
export const PROJECT_LEAVE = 'projectleave';

export function useProjectSnap(panels: ProjectPanel[]) {
  return useSnapNavigation({
    panels,
    enterEvent: PROJECT_ENTER,
    leaveEvent: PROJECT_LEAVE,
  });
}