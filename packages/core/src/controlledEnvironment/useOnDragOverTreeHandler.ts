import * as React from 'react';
import { DraggingPosition, TreeCapabilities } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';

const isOutsideOfContainer = (e: DragEvent, treeBb: DOMRect) => {
  return e.clientX < treeBb.left || e.clientX > treeBb.right || e.clientY < treeBb.top || e.clientY > treeBb.bottom;
};

const getHoveringPosition = (clientY: number, treeTop: number, itemHeight: number, capabilities: TreeCapabilities) => {
  const hoveringPosition = (clientY - treeTop) / itemHeight;

  const linearIndex = Math.floor(hoveringPosition);
  let offset: 'top' | 'bottom' | undefined = undefined;

  const lineThreshold = capabilities.canDropOnItemWithChildren || capabilities.canDropOnItemWithoutChildren ? 0.2 : 0.5;

  if (hoveringPosition % 1 < lineThreshold) {
    offset = 'top';
  } else if (hoveringPosition % 1 > 1 - lineThreshold) {
    offset = 'bottom';
  }

  return { linearIndex, offset };
};

export const useOnDragOverTreeHandler = (
  lastDragCode: string,
  setLastDragCode: (code: string) => void,
  itemHeight: number,
  linearItems: { [treeId: string]: ReturnType<typeof getItemsLinearly> },
  onDragAtPosition: (draggingPosition: DraggingPosition | undefined) => void,
  onPerformDrag: (draggingPosition: DraggingPosition) => void
) => {
  const environment = useTreeEnvironment();
  const getParentOfLinearItem = useGetGetParentOfLinearItem();

  return (e: DragEvent, treeId: string, containerRef: React.MutableRefObject<HTMLElement | undefined>) => {
    if (!environment.canDragAndDrop) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    if (e.clientX < 0 || e.clientY < 0) {
      return; // TODO hotfix
    }

    const treeBb = containerRef.current.getBoundingClientRect();
    const outsideContainer = isOutsideOfContainer(e, treeBb);

    let { linearIndex, offset } = getHoveringPosition(e.clientY, treeBb.top, itemHeight, environment);

    const nextDragCode = outsideContainer ? 'outside' : `${treeId}${linearIndex}${offset ?? ''}`;

    if (lastDragCode === nextDragCode) {
      return;
    }

    setLastDragCode(nextDragCode);

    if (outsideContainer) {
      onDragAtPosition(undefined);
      return;
    }

    if (linearIndex < 0 || linearIndex >= linearItems[treeId].length) {
      onDragAtPosition(undefined);
      return;
    }

    const targetItem = linearItems[treeId][linearIndex];
    const depth = targetItem.depth;
    const targetItemData = environment.items[targetItem.item];

    if (!offset && !environment.canDropOnItemWithoutChildren && !targetItemData.hasChildren) {
      onDragAtPosition(undefined);
      return;
    }

    if (!offset && !environment.canDropOnItemWithChildren && targetItemData.hasChildren) {
      onDragAtPosition(undefined);
      return;
    }

    if (offset && !environment.canReorderItems) {
      onDragAtPosition(undefined);
      return;
    }

    const parent = getParentOfLinearItem(linearItems[treeId], linearIndex, treeId);

    if (environment.viewState[treeId]?.selectedItems?.includes(targetItem.item)) {
      return;
    }

    const newChildIndex =
      environment.items[parent.item].children!.indexOf(targetItem.item) + (offset === 'top' ? 0 : 1);

    if (offset === 'top' && depth === (linearItems[treeId][linearIndex - 1]?.depth ?? -1)) {
      offset = 'bottom';
      linearIndex -= 1;
    }

    let draggingPosition: DraggingPosition;

    if (offset) {
      draggingPosition = {
        targetType: 'between-items',
        treeId: treeId,
        parentItem: parent.item,
        depth: targetItem.depth,
        linearIndex: linearIndex + (offset === 'top' ? 0 : 1),
        // childIndex: linearIndex - parentLinearIndex - 1 + (offset === 'top' ? 0 : 1),
        // childIndex: environment.items[parent.item].children!.indexOf(targetItem.item) + (offset === 'top' ? 0 : 1),
        childIndex: newChildIndex,
        linePosition: offset,
      };
    } else {
      draggingPosition = {
        targetType: 'item',
        treeId: treeId,
        parentItem: parent.item,
        targetItem: targetItem.item,
        depth: targetItem.depth,
        linearIndex: linearIndex,
      };
    }

    onPerformDrag(draggingPosition);
  };
};
