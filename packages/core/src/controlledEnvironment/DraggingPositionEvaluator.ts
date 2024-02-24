import * as React from 'react';
import {
  DraggingPosition,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';
import { isOutsideOfContainer } from './layoutUtils';
import { DraggingPositionEvaluation } from './DraggingPositionEvaluation';

// TODO move out
export type HoveringPosition = {
  linearIndex: number;
  offset: 'bottom' | 'top' | undefined;
  indentation: number;
};

// TODO move back into hook?
export class DraggingPositionEvaluator {
  private env: TreeEnvironmentContextProps;

  public readonly getParentOfLinearItem: ReturnType<
    typeof useGetGetParentOfLinearItem
  >;

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
  ): DraggingPosition | 'invalid' | undefined {
    const hoveringPosition = this.getHoveringPosition(e, treeId, containerRef);

    if (!this.isNewDragPosition(e, treeId, hoveringPosition)) {
      return undefined;
    }

    if (
      !this.draggingItems ||
      !this.env.canDragAndDrop ||
      !hoveringPosition ||
      e.clientX < 0 ||
      e.clientY < 0
    ) {
      return 'invalid';
    }

    return new DraggingPositionEvaluation(
      this,
      this.env,
      e,
      treeId,
      hoveringPosition
    ).getDraggingPosition();
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
    const linearIndex = Math.min(
      Math.max(0, Math.floor(hoveringPosition)),
      treeLinearItems.length - 1
    );

    const targetLinearItem = treeLinearItems[linearIndex];
    const targetItem = this.env.items[targetLinearItem.item];

    const indentation = Math.min(
      Math.max(
        Math.floor((e.clientX - treeBb.left) / this.env.renderDepthOffset),
        0
      ),
      targetLinearItem.depth
    );

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

    return { linearIndex, offset, indentation };
  }

  private isNewDragPosition(
    e: DragEvent,
    treeId: string,
    hoveringPosition: HoveringPosition | undefined
  ) {
    if (!hoveringPosition) {
      return false;
    }
    const { offset, linearIndex } = hoveringPosition;

    const newDragCode = `${treeId}__${linearIndex}__${offset ?? ''}__${
      hoveringPosition.indentation
    }`;
    if (newDragCode !== this.dragCode) {
      this.dragCode = newDragCode;
      return true;
    }

    return false;
  }
}
