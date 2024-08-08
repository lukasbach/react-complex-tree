import { getDocument } from '../utils';

export const computeItemHeight = (treeId: string) => {
  const firstItem = getDocument()?.querySelector<HTMLElement>(
    `[data-rct-tree="${treeId}"] [data-rct-item-container="true"]`
  );
  if (firstItem) {
    const style = getComputedStyle(firstItem);
    // top margin flows into the bottom margin of the previous item, so ignore it
    return (
      firstItem.offsetHeight +
      Math.max(parseFloat(style.marginTop), parseFloat(style.marginBottom))
    );
  }
  return 5;
};

export const computeItemHeightArray = (treeId: string): number[] => {
  const document = getDocument();
  if (!document) {
    console.log("Document not found");
    return [];
  }
  const items = document.querySelectorAll<HTMLElement>(`[data-rct-tree="${treeId}"] [data-rct-item-container="true"]`);
  const itemHeights = Array.from(items).map(item => item.offsetHeight);

  console.log({ itemHeights });
  return itemHeights;
};

export const isOutsideOfContainer = (e: DragEvent, treeBb: DOMRect) =>
  e.clientX < treeBb.left ||
  e.clientX > treeBb.right ||
  e.clientY < treeBb.top ||
  e.clientY > treeBb.bottom;
