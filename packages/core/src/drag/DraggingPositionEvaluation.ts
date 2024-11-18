import {
  DraggingPosition,
  HoveringPosition,
  LinearItem,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';

export class DraggingPositionEvaluation {
  private readonly env: TreeEnvironmentContextProps;

  public readonly getParentOfLinearItem: ReturnType<
    typeof useGetGetParentOfLinearItem
  >;

  private readonly e: DragEvent;

  private readonly treeId: string;

  private linearIndex: number;

  private offset: 'bottom' | 'top' | undefined;

  private indentation: number | undefined;

  private targetItem: LinearItem;

  private draggingItems: TreeItem[] | undefined;

  constructor(
    env: TreeEnvironmentContextProps,
    e: DragEvent,
    treeId: string,
    hoveringPosition: HoveringPosition,
    draggingItems: TreeItem[] | undefined,
    getParentOfLinearItem: ReturnType<typeof useGetGetParentOfLinearItem>
  ) {
    this.env = env;
    this.e = e;
    this.treeId = treeId;
    this.linearIndex = hoveringPosition.linearIndex;
    this.offset = hoveringPosition.offset;
    this.indentation = hoveringPosition.indentation;
    this.targetItem = this.env.linearItems[this.treeId][this.linearIndex];
    this.getParentOfLinearItem = getParentOfLinearItem;
    this.draggingItems = draggingItems;
  }

  private getEmptyTreeDragPosition(): DraggingPosition {
    return {
      targetType: 'root',
      treeId: this.treeId,
      depth: 0,
      linearIndex: 0,
      targetItem: this.env.trees[this.treeId].rootItem,
    };
  }

  /**
   * If reordering is not allowed, dragging on non-folder items redirects
   * the drag target to the parent of the target item.
   */
  private maybeRedirectToParent() {
    const redirectTargetToParent =
      !this.env.canReorderItems &&
      !this.env.canDropOnNonFolder &&
      !this.env.items[this.targetItem.item].isFolder;

    if (redirectTargetToParent) {
      const { parentLinearIndex, parent } = this.getParentOfLinearItem(
        this.linearIndex,
        this.treeId
      );
      this.targetItem = parent;
      this.linearIndex = parentLinearIndex;
    }
  }

  /**
   * If the item is the last in a group, and the drop is at the bottom,
   * the x-coordinate of the mouse allows to reparent upwards.
   */
  private maybeReparentUpwards(): DraggingPosition | undefined {
    if (this.indentation === undefined) {
      return undefined;
    }

    const treeLinearItems = this.env.linearItems[this.treeId];
    const deepestDepth = treeLinearItems[this.linearIndex].depth;

    // Default to zero on last position to allow dropping on root when
    // dropping at bottom
    const legalDropDepthCount = // itemDepthDifferenceToNextItem/isLastInGroup
      deepestDepth - (treeLinearItems[this.linearIndex + 1]?.depth ?? 0);

    const canReparentUpwards =
      this.offset === 'bottom' && legalDropDepthCount > 0;

    if (!canReparentUpwards) {
      return undefined;
    }

    const droppingIndent = Math.max(
      deepestDepth - legalDropDepthCount,
      this.indentation
    );

    let newParent = {
      parentLinearIndex: this.linearIndex,
      parent: this.targetItem,
    };
    let insertionItemAbove: typeof newParent | undefined;

    for (let i = deepestDepth; i >= droppingIndent; i -= 1) {
      insertionItemAbove = newParent;
      newParent = this.getParentOfLinearItem(
        newParent.parentLinearIndex,
        this.treeId
      );
    }

    if (this.indentation === treeLinearItems[this.linearIndex].depth) {
      return undefined;
    }
    if (!insertionItemAbove) {
      return undefined;
    }

    const reparentedChildIndex =
      this.env.items[newParent.parent.item].children!.indexOf(
        insertionItemAbove.parent.item
      ) + 1;

    if (
      this.draggingItems &&
      this.isDescendant(
        this.treeId,
        newParent.parentLinearIndex + 1,
        this.draggingItems
      )
    ) {
      return undefined;
    }

    return {
      targetType: 'between-items',
      treeId: this.treeId,
      parentItem: newParent.parent.item,
      depth: droppingIndent,
      linearIndex: this.linearIndex + 1,
      childIndex: reparentedChildIndex,
      linePosition: 'bottom',
    } as const;
  }

  /**
   * Don't allow to drop at bottom of an open folder, since that will place
   * it visually at a different position. Redirect the drag target to the
   * top of the folder contents in that case.
   */
  private maybeRedirectInsideOpenFolder() {
    const nextItem = this.env.linearItems[this.treeId][this.linearIndex + 1];
    const redirectInsideOpenFolder =
      !this.env.canDropBelowOpenFolders &&
      nextItem &&
      this.targetItem.depth === nextItem.depth - 1 &&
      this.offset === 'bottom';
    if (redirectInsideOpenFolder) {
      this.targetItem = nextItem;
      this.linearIndex += 1;
      this.offset = 'top';
    }
  }

  /**
   * Inside a folder, only drop at bottom offset to make it visually
   * consistent. This also maps to bottom offset for items below open
   * subtrees, to keep the x-coordinate based dropping consistent (only
   * if indentation is defined).
   */
  private maybeMapToBottomOffset() {
    const priorItem = this.env.linearItems[this.treeId][this.linearIndex - 1];

    if (!priorItem || priorItem?.depth === undefined) return;

    const depthDistanceToPrior = priorItem.depth - this.targetItem.depth;

    if (
      this.offset === 'top' &&
      (depthDistanceToPrior === 0 ||
        (depthDistanceToPrior > 0 && this.indentation !== undefined))
    ) {
      this.offset = 'bottom';
      this.linearIndex -= 1;
      this.targetItem = this.env.linearItems[this.treeId][this.linearIndex];
    }
  }

  private canDropAtCurrentTarget() {
    const targetItemData = this.env.items[this.targetItem.item];

    if (
      !this.offset &&
      !this.env.canDropOnNonFolder &&
      !targetItemData.isFolder
    ) {
      return false;
    }

    if (!this.offset && !this.env.canDropOnFolder && targetItemData.isFolder) {
      return false;
    }

    if (this.offset && !this.env.canReorderItems) {
      return false;
    }

    if (
      this.draggingItems?.some(
        draggingItem => draggingItem.index === this.targetItem.item
      )
    ) {
      return false;
    }

    return true;
  }

  getDraggingPosition(): DraggingPosition | 'invalid' | undefined {
    if (this.env.linearItems[this.treeId].length === 0) {
      return this.getEmptyTreeDragPosition();
    }

    if (
      !this.draggingItems ||
      this.linearIndex < 0 ||
      this.linearIndex >= this.env.linearItems[this.treeId].length
    ) {
      return undefined;
    }

    this.maybeRedirectToParent();

    this.maybeRedirectInsideOpenFolder();
    this.maybeMapToBottomOffset();

    const reparented = this.maybeReparentUpwards();
    if (reparented) {
      return reparented;
    }

    if (this.areDraggingItemsDescendantOfTarget()) {
      return 'invalid';
    }

    if (!this.canDropAtCurrentTarget()) {
      return 'invalid';
    }

    const { parent } = this.getParentOfLinearItem(
      this.linearIndex,
      this.treeId
    );
    const newChildIndex =
      this.env.items[parent.item].children!.indexOf(this.targetItem.item) +
      (this.offset === 'top' ? 0 : 1);

    if (this.offset) {
      return {
        targetType: 'between-items',
        treeId: this.treeId,
        parentItem: parent.item,
        depth: this.targetItem.depth,
        linearIndex: this.linearIndex + (this.offset === 'top' ? 0 : 1),
        childIndex: newChildIndex,
        linePosition: this.offset,
      };
    }
    return {
      targetType: 'item',
      treeId: this.treeId,
      parentItem: parent.item,
      targetItem: this.targetItem.item,
      depth: this.targetItem.depth,
      linearIndex: this.linearIndex,
    };
  }

  private isDescendant(
    treeId: string,
    itemLinearIndex: number,
    potentialParents: TreeItem[]
  ) {
    // console.log('descendant check', itemLinearIndex, potentialParents);
    const { parentLinearIndex, parent } = this.getParentOfLinearItem(
      itemLinearIndex,
      treeId
    );

    if (potentialParents.some(p => p.index === parent.item)) {
      return true;
    }

    if (parent.depth === 0) {
      return false;
    }

    return this.isDescendant(treeId, parentLinearIndex, potentialParents);
  }

  private areDraggingItemsDescendantOfTarget() {
    return (
      this.draggingItems &&
      this.isDescendant(this.treeId, this.linearIndex, this.draggingItems)
    );
  }
}
