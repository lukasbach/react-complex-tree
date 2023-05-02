import { getDocument } from '../utils';

export const computeItemHeight = (treeId: string) => {
  const firstItem = getDocument()?.querySelector<HTMLElement>(
    `[data-rct-tree="${treeId}"] [data-rct-item-container="true"]`
  );
  return firstItem?.offsetHeight ?? 5;
};

export const isOutsideOfContainer = (e: DragEvent, treeBb: DOMRect) =>
  e.clientX < treeBb.left ||
  e.clientX > treeBb.right ||
  e.clientY < treeBb.top ||
  e.clientY > treeBb.bottom;
