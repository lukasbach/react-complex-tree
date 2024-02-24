import * as React from 'react';
import {
  DraggingPosition,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';
import { isOutsideOfContainer } from './layoutUtils';

type HoveringPosition = {
  linearIndex: number;
  offset: 'bottom' | 'top' | undefined;
  veryBottom: boolean;
};

export class DraggingPositionEvaluator {
  private env: TreeEnvironmentContextProps;

  private getParentOfLinearItem: ReturnType<typeof useGetGetParentOfLinearItem>;

  private dragCode = 'initial';

  public readonly draggingItems: TreeItem[] | undefined;

  public readonly itemHeight: number;

  constructor(
    env: TreeEnvironmentContextProps,
    getParentOfLinearItem: ReturnType<typeof useGetGetParentOfLinearItem>,
    draggingItems: TreeItem[] | undefined,
    itemHeight: number
  ) {
    this.env = env;
    this.getParentOfLinearItem = getParentOfLinearItem;
    this.draggingItems = draggingItems;
    this.itemHeight = itemHeight;
  }

  // returning undefined means calling onDragAtPosition(undefined), returning a dropposition means calling onPerformDrag(dropposition)
  // TODO old function sometimes returned undefined when old state could be kept; is it okay to also return undefined to enter invalid drop state here? e.g. !this.draggingItems, !canDragAndDrop...
  getDraggingPosition(
    e: DragEvent,
    treeId: string,
    containerRef: React.MutableRefObject<HTMLElement | undefined>
  ): DraggingPosition | undefined {
    const hoveringPosition = this.getHoveringPosition(e, treeId, containerRef);

    if (
      !this.draggingItems ||
      !this.env.canDragAndDrop ||
      !hoveringPosition ||
      !this.isNewDragPosition(e, treeId, hoveringPosition)
    ) {
      return undefined;
    }

    if (e.clientX < 0 || e.clientY < 0) {
      return undefined;
    }

    if (this.env.linearItems[treeId].length === 0) {
      // Empty tree
      return {
        targetType: 'root',
        treeId,
        depth: 0,
        linearIndex: 0,
        targetItem: this.env.trees[treeId].rootItem,
      };
    }

    // eslint-disable-next-line prefer-const
    let { linearIndex, offset, veryBottom } = hoveringPosition;

    if (linearIndex < 0 || linearIndex >= this.env.linearItems[treeId].length) {
      return undefined;
    }

    let targetItem = this.env.linearItems[treeId][linearIndex];
    const redirectTargetToParent =
      !this.env.canReorderItems &&
      !this.env.canDropOnNonFolder &&
      !this.env.items[targetItem.item].isFolder;

    if (redirectTargetToParent) {
      const { parentLinearIndex, parent } = this.getParentOfLinearItem(
        linearIndex,
        treeId
      );
      targetItem = parent;
      linearIndex = parentLinearIndex;
    }

    if (this.isDescendant(treeId, linearIndex, this.draggingItems)) {
      return undefined;
    }

    const nextItem = this.env.linearItems[treeId][linearIndex + 1];
    const redirectToFirstChild =
      !this.env.canDropBelowOpenFolders &&
      nextItem &&
      targetItem.depth === nextItem.depth - 1 &&
      offset === 'bottom';
    if (redirectToFirstChild) {
      targetItem = nextItem;
      linearIndex += 1;
      offset = 'top';
    }

    const { depth } = targetItem;
    const targetItemData = this.env.items[targetItem.item];

    if (!offset && !this.env.canDropOnNonFolder && !targetItemData.isFolder) {
      return undefined;
    }

    if (!offset && !this.env.canDropOnFolder && targetItemData.isFolder) {
      return undefined;
    }

    if (offset && !this.env.canReorderItems) {
      return undefined;
    }

    const { parent } = this.getParentOfLinearItem(linearIndex, treeId);

    if (
      this.draggingItems.some(
        draggingItem => draggingItem.index === targetItem.item
      )
    ) {
      return undefined;
    }

    const newChildIndex =
      this.env.items[parent.item].children!.indexOf(targetItem.item) +
      (offset === 'top' ? 0 : 1);

    if (
      offset === 'top' &&
      depth === (this.env.linearItems[treeId][linearIndex - 1]?.depth ?? -1)
    ) {
      offset = 'bottom';
      linearIndex -= 1;
    }

    if (veryBottom) {
      const { rootItem } = this.env.trees[treeId];
      return {
        targetType: 'between-items',
        treeId,
        parentItem: rootItem,
        depth: 0,
        linearIndex: linearIndex + 1,
        childIndex: this.env.items[rootItem].children?.length ?? 0,
        linePosition: 'bottom',
      };
    }
    if (offset) {
      return {
        targetType: 'between-items',
        treeId,
        parentItem: parent.item,
        depth: targetItem.depth,
        linearIndex: linearIndex + (offset === 'top' ? 0 : 1),
        childIndex: newChildIndex,
        linePosition: offset,
      };
    }
    return {
      targetType: 'item',
      treeId,
      parentItem: parent.item,
      targetItem: targetItem.item,
      depth: targetItem.depth,
      linearIndex,
    };
  }

  /**
   * Returns undefined for invalid drop targets, like outside the tree.
   */
  private getHoveringPosition(
    e: DragEvent,
    treeId: string,
    containerRef: React.MutableRefObject<HTMLElement | undefined>
  ): HoveringPosition | undefined {
    const { canDropOnFolder, canDropOnNonFolder, canReorderItems } = this.env;

    if (!containerRef.current) {
      return undefined;
    }

    const treeBb = containerRef.current.getBoundingClientRect();

    if (isOutsideOfContainer(e, treeBb)) {
      return undefined;
    }

    const hoveringPosition = (e.clientY - treeBb.top) / this.itemHeight;

    const treeLinearItems = this.env.linearItems[treeId];
    const linearIndex = Math.max(0, Math.floor(hoveringPosition));

    if (linearIndex > treeLinearItems.length - 1) {
      return {
        linearIndex: treeLinearItems.length - 1,
        offset: 'bottom',
        veryBottom: true,
      } as const;
    }

    const targetLinearItem = treeLinearItems[linearIndex];
    const targetItem = this.env.items[targetLinearItem.item];
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

    return { linearIndex, offset, veryBottom: false };
  }

  private isDescendant(
    treeId: string,
    itemLinearIndex: number,
    potentialParents: TreeItem[]
  ) {
    const { parentLinearIndex, parent } = this.getParentOfLinearItem(
      itemLinearIndex,
      treeId
    );

    if (potentialParents.find(p => p.index === parent.item)) {
      return true;
    }

    if (parent.depth === 0) {
      return false;
    }

    return this.isDescendant(treeId, parentLinearIndex, potentialParents);
  }

  private isNewDragPosition(
    e: DragEvent,
    treeId: string,
    hoveringPosition: HoveringPosition | undefined
  ) {
    if (!hoveringPosition) {
      return false;
    }
    const { offset, linearIndex, veryBottom } = hoveringPosition;

    const newDragCode = `${treeId}${linearIndex}${offset ?? ''}${
      veryBottom && 'vb'
    }`;
    if (newDragCode !== this.dragCode) {
      this.dragCode = newDragCode;
      return true;
    }

    return false;
  }
}
