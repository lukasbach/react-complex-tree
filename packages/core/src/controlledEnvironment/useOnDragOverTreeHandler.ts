import * as React from 'react';
import {
  DraggingPosition,
  LinearItem,
  TreeItem,
  TreeItemIndex,
} from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';
import { isOutsideOfContainer } from './layoutUtils';
import { useStableHandler } from '../use-stable-handler';

const getHoveringPosition = (
  clientY: number,
  treeTop: number,
  itemHeight: number,
  linearItems: Record<string, LinearItem[]>,
  treeId: string,
  items: Record<TreeItemIndex, TreeItem>,
  canDropOnFolder?: boolean,
  canDropOnNonFolder?: boolean,
  canReorderItems?: boolean
) => {
  const hoveringPosition = (clientY - treeTop) / itemHeight;

  const treeLinearItems = linearItems[treeId];
  const linearIndex = Math.max(0, Math.floor(hoveringPosition));

  if (linearIndex > treeLinearItems.length - 1) {
    return {
      linearIndex: treeLinearItems.length - 1,
      targetItem: treeLinearItems[treeLinearItems.length - 1].item,
      offset: 'bottom',
      targetLinearItem: treeLinearItems[treeLinearItems.length - 1],
    } as const;
  }

  const targetLinearItem = treeLinearItems[linearIndex];
  const targetItem = items[targetLinearItem.item];
  let offset: 'top' | 'bottom' | undefined;

  const lineThreshold = !canReorderItems
    ? 0
    : (targetItem?.isFolder && canDropOnFolder) || canDropOnNonFolder
    ? 0.2
    : 0.5;

  if (hoveringPosition % 1 < lineThreshold) {
    offset = 'top';
  } else if (hoveringPosition % 1 > 1 - lineThreshold) {
    offset = 'bottom';
  }

  return { linearIndex, offset, targetItem, targetLinearItem };
};

const useIsDescendant = () => {
  const getParentOfLinearItem = useGetGetParentOfLinearItem();
  const isDescendant = (
    treeId: string,
    itemLinearIndex: number,
    potentialParents: TreeItem[]
  ) => {
    const { parentLinearIndex, parent } = getParentOfLinearItem(
      itemLinearIndex,
      treeId
    );

    if (potentialParents.find(p => p.index === parent.item)) {
      return true;
    }

    if (parent.depth === 0) {
      return false;
    }

    return isDescendant(treeId, parentLinearIndex, potentialParents);
  };
  return isDescendant;
};

export const useOnDragOverTreeHandler = (
  lastDragCode: string,
  setLastDragCode: (code: string) => void,
  draggingItems: TreeItem[] | undefined,
  itemHeight: number,
  onDragAtPosition: (draggingPosition: DraggingPosition | undefined) => void,
  onPerformDrag: (draggingPosition: DraggingPosition) => void
) => {
  const {
    canDropOnFolder,
    canDropOnNonFolder,
    canDragAndDrop,
    linearItems,
    items,
    canReorderItems,
    trees,
  } = useTreeEnvironment();
  const getParentOfLinearItem = useGetGetParentOfLinearItem();
  const isDescendant = useIsDescendant();

  return useStableHandler(
    (
      e: DragEvent,
      treeId: string,
      containerRef: React.MutableRefObject<HTMLElement | undefined>
    ) => {
      if (!draggingItems) {
        return;
      }

      if (!canDragAndDrop) {
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

      if (linearItems[treeId].length === 0) {
        // Empty tree
        onPerformDrag({
          targetType: 'root',
          treeId,
          depth: 0,
          linearIndex: 0,
          targetItem: trees[treeId].rootItem,
        });
        return;
      }

      let { linearIndex, offset } = getHoveringPosition(
        e.clientY,
        treeBb.top,
        itemHeight,
        linearItems,
        treeId,
        items,
        canDropOnFolder,
        canDropOnNonFolder,
        canReorderItems
      );

      const nextDragCode = outsideContainer
        ? 'outside'
        : `${treeId}${linearIndex}${offset ?? ''}`;

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

      let targetItem = linearItems[treeId][linearIndex];
      const redirectTargetToParent =
        !canReorderItems &&
        !canDropOnNonFolder &&
        !items[targetItem.item].isFolder;

      if (redirectTargetToParent) {
        const { parentLinearIndex, parent } = getParentOfLinearItem(
          linearIndex,
          treeId
        );
        targetItem = parent;
        linearIndex = parentLinearIndex;
      }

      if (isDescendant(treeId, linearIndex, draggingItems)) {
        onDragAtPosition(undefined);
        return;
      }

      const { depth } = targetItem;
      const targetItemData = items[targetItem.item];

      if (!offset && !canDropOnNonFolder && !targetItemData.isFolder) {
        onDragAtPosition(undefined);
        return;
      }

      if (!offset && !canDropOnFolder && targetItemData.isFolder) {
        onDragAtPosition(undefined);
        return;
      }

      if (offset && !canReorderItems) {
        onDragAtPosition(undefined);
        return;
      }

      const { parent } = getParentOfLinearItem(linearIndex, treeId);

      if (
        draggingItems.some(
          draggingItem => draggingItem.index === targetItem.item
        )
      ) {
        onDragAtPosition(undefined);
        return;
      }

      const newChildIndex =
        items[parent.item].children!.indexOf(targetItem.item) +
        (offset === 'top' ? 0 : 1);

      if (
        offset === 'top' &&
        depth === (linearItems[treeId][linearIndex - 1]?.depth ?? -1)
      ) {
        offset = 'bottom';
        linearIndex -= 1;
      }

      let draggingPosition: DraggingPosition;

      if (offset) {
        draggingPosition = {
          targetType: 'between-items',
          treeId,
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
          treeId,
          parentItem: parent.item,
          targetItem: targetItem.item,
          depth: targetItem.depth,
          linearIndex,
        };
      }

      onPerformDrag(draggingPosition);
    }
  );
};
