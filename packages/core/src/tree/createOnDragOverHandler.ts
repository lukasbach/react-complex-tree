import { DraggingPosition, TreeCapabilities, TreeEnvironmentContextProps } from '../types';
import * as React from 'react';
import { useGetLinearItems } from './useGetLinearItems';

export const isOutsideOfContainer = (e: DragEvent, treeBb: DOMRect) => {
  return e.clientX < treeBb.left
    || e.clientX > treeBb.right
    || e.clientY < treeBb.top
    || e.clientY > treeBb.bottom;
};

export const getHoveringPosition = (clientY: number, treeTop: number, itemHeight: number, capabilities: TreeCapabilities) => {
  const hoveringPosition = (clientY - treeTop) / itemHeight;

  let linearIndex = Math.floor(hoveringPosition);
  let offset: 'top' | 'bottom' | undefined = undefined;

  const lineThreshold = (capabilities.allowDropOnItemWithChildren || capabilities.allowDropOnItemWithoutChildren) ? .2 : .5;

  if (hoveringPosition % 1 < lineThreshold) {
    offset = 'top';
  } else if (hoveringPosition % 1 > 1 - lineThreshold) {
    offset = 'bottom';
  } else {
  }

  return { linearIndex, offset };
};

export const createOnDragOverHandler = (
  environment: TreeEnvironmentContextProps,
  containerRef: React.MutableRefObject<HTMLElement | undefined>,
  lastHoverCode: React.MutableRefObject<string | undefined>,
  getLinearItems: ReturnType<typeof useGetLinearItems>,
  rootItem: string,
  treeId: string
) => {
  return (e: DragEvent) => {
    if (!environment.allowDragAndDrop) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    if (e.clientX < 0 || e.clientY < 0) {
      // console.log("Drag aborted due to mouse coords being negative");
      return; // TODO hotfix
    }

    const treeBb = containerRef.current.getBoundingClientRect();
    const outsideContainer = isOutsideOfContainer(e, treeBb);

    // console.log(outsideContainer, treeBb, e.clientX, e.clientY);

    let { linearIndex, offset } = getHoveringPosition(e.clientY, treeBb.top, environment.itemHeight, environment);

    const hoveringCode = outsideContainer ? 'outside' : `${linearIndex}${offset ?? ''}`;

    if (lastHoverCode.current !== hoveringCode) {
      lastHoverCode.current = hoveringCode;

      if (outsideContainer) {
        environment.onDragAtPosition(undefined);
        // console.log("Drag aborted due to being out of container");
        return;
      }

      const linearItems = getLinearItems();

      if (linearIndex < 0 || linearIndex >= linearItems.length) {
        environment.onDragAtPosition(undefined);
        // console.log("Drag aborted due to being out of linear list");
        return;
      }

      const targetItem = linearItems[linearIndex];
      const depth = targetItem.depth;
      const targetItemData = environment.items[targetItem.item];

      if (!offset && !environment.allowDropOnItemWithoutChildren && !targetItemData.hasChildren) {
        environment.onDragAtPosition(undefined);
        // console.log("Drag aborted due to allowDropOnItemWithoutChildren");
        return;
      }

      if (!offset && !environment.allowDropOnItemWithChildren && targetItemData.hasChildren) {
        environment.onDragAtPosition(undefined);
        // console.log("Drag aborted due to allowDropOnItemWithChildren");
        return;
      }

      if (offset && !environment.allowReorderingItems) {
        environment.onDragAtPosition(undefined);
        // console.log("Drag aborted due to allowReorderingItems");
        return;
      }


      let parentLinearIndex = linearIndex;
      for (; !!linearItems[parentLinearIndex] && linearItems[parentLinearIndex].depth !== depth - 1; parentLinearIndex--);
      let parent = linearItems[parentLinearIndex];

      if (!parent) {
        parent = { item: rootItem, depth: 0 };
        parentLinearIndex = 0;
      }

      if (environment.viewState[treeId]?.selectedItems?.includes(targetItem.item)) {
        return;
      }

      const newChildIndex = environment.items[parent.item].children!.indexOf(targetItem.item) + (offset === 'top' ? 0 : 1);

      if (offset === 'top' && depth === (linearItems[linearIndex - 1]?.depth ?? -1)) {
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


      if (environment.canDropAt && (!environment.draggingItems
        || !environment.canDropAt(environment.draggingItems, draggingPosition))) {
        environment.onDragAtPosition(undefined);
        return;
      }

      environment.onDragAtPosition(draggingPosition);

      // if (environment.activeTreeId !== props.treeId) {
      environment.setActiveTree(treeId);

      if (environment.draggingItems && environment.onSelectItems && environment.activeTreeId !== treeId) {
        environment.onSelectItems(environment.draggingItems.map(item => item.index), treeId);
      }
      // }
    }
  };
}