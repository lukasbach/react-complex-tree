import {
  DraggingPosition,
  HoveringPosition,
  LinearItem,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';
import { useGetGetParentOfLinearItem } from '../controlledEnvironment/useGetParentOfLinearItem';

export class DraggingPositionEvaluation {
  private readonly env: TreeEnvironmentContextProps;

  public readonly getParentOfLinearItem: ReturnType<
    typeof useGetGetParentOfLinearItem
  >;

  private readonly e: DragEvent;

  private readonly treeId: string;

  private linearIndex: number;

  private offset: 'bottom' | 'top' | undefined;

  private indentation: number;

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

    // this.targetItem = newParent.parent;
    const reparentedChildIndex =
      this.env.items[newParent.parent.item].children!.indexOf(
        insertionItemAbove.parent.item
      ) + 1;
    console.log(
      `new parent is ${newParent.parent.item}, target is ${this.targetItem.item} and reparentedChildIndex is ${reparentedChildIndex}}`
    );
    console.log(newParent);
    console.log('new depth is', newParent.parent.depth + 1);

    return {
      targetType: 'between-items',
      treeId: this.treeId,
      // parentItem: this.evaluator.getParentOfLinearItem(
      //   newParent.parentLinearIndex,
      //   this.treeId
      // ).parent.item,
      parentItem: newParent.parent.item,
      // depth: newParent.parent.depth + 1,
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
   * consistent.
   */
  private maybeMapToBottomOffset() {
    const priorItem = this.env.linearItems[this.treeId][this.linearIndex - 1];
    if (
      this.offset === 'top' &&
      this.targetItem.depth === (priorItem?.depth ?? -1)
    ) {
      this.offset = 'bottom';
      this.linearIndex -= 1;
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

  getDraggingPosition(): DraggingPosition | undefined {
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

    if (this.areDraggingItemsDescendantOfTarget()) {
      return undefined;
    }

    const reparented = this.maybeReparentUpwards();
    if (reparented) {
      return reparented;
    }

    this.maybeRedirectInsideOpenFolder();

    // Must run before maybeMapToBottomOffset
    const { parent } = this.getParentOfLinearItem(
      this.linearIndex,
      this.treeId
    );
    const newChildIndex =
      this.env.items[parent.item].children!.indexOf(this.targetItem.item) +
      (this.offset === 'top' ? 0 : 1);

    this.maybeMapToBottomOffset();

    if (!this.canDropAtCurrentTarget()) {
      return undefined;
    }

    // used to be here: this.maybeMapToBottomOffset();.. moved up for better readability

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

  private areDraggingItemsDescendantOfTarget() {
    return (
      this.draggingItems &&
      this.isDescendant(this.treeId, this.linearIndex, this.draggingItems)
    );
  }
}
