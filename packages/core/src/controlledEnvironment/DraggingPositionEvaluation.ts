import {
  DraggingPositionEvaluator,
  HoveringPosition,
} from './DraggingPositionEvaluator';
import {
  DraggingPosition,
  LinearItem,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';

export class DraggingPositionEvaluation {
  private readonly evaluator: DraggingPositionEvaluator;

  private readonly env: TreeEnvironmentContextProps;

  private readonly e: DragEvent;

  private readonly treeId: string;

  private linearIndex: number;

  private offset: 'bottom' | 'top' | undefined;

  private indentation: number;

  private targetItem: LinearItem;

  constructor(
    evaluator: DraggingPositionEvaluator,
    env: TreeEnvironmentContextProps,
    e: DragEvent,
    treeId: string,
    hoveringPosition: HoveringPosition
  ) {
    this.evaluator = evaluator;
    this.env = env;
    this.e = e;
    this.treeId = treeId;
    this.linearIndex = hoveringPosition.linearIndex;
    this.offset = hoveringPosition.offset;
    this.indentation = hoveringPosition.indentation;
    this.targetItem = this.env.linearItems[this.treeId][this.linearIndex];
  }

  getDraggingPosition(): DraggingPosition | undefined {
    if (!this.evaluator.draggingItems) {
      return undefined;
    }

    if (this.env.linearItems[this.treeId].length === 0) {
      // Empty tree
      return {
        targetType: 'root',
        treeId: this.treeId,
        depth: 0,
        linearIndex: 0,
        targetItem: this.env.trees[this.treeId].rootItem,
      };
    }

    if (
      this.linearIndex < 0 ||
      this.linearIndex >= this.env.linearItems[this.treeId].length
    ) {
      return undefined;
    }

    const redirectTargetToParent =
      !this.env.canReorderItems &&
      !this.env.canDropOnNonFolder &&
      !this.env.items[this.targetItem.item].isFolder;

    if (redirectTargetToParent) {
      const { parentLinearIndex, parent } =
        this.evaluator.getParentOfLinearItem(this.linearIndex, this.treeId);
      this.targetItem = parent;
      this.linearIndex = parentLinearIndex;
    }

    if (
      this.isDescendant(
        this.treeId,
        this.linearIndex,
        this.evaluator.draggingItems
      )
    ) {
      return undefined;
    }

    const treeLinearItems = this.env.linearItems[this.treeId];
    const deepestDepth = treeLinearItems[this.linearIndex].depth;
    const legalDropDepthCount = // itemDepthDifferenceToNextItem/isLastInGroup
      deepestDepth - (treeLinearItems[this.linearIndex + 1]?.depth ?? 0);
    const canReparentUpwards =
      this.offset === 'bottom' && legalDropDepthCount > 0;
    // Default to zero on last position to allow dropping on root when
    // dropping at bottom
    if (canReparentUpwards) {
      const droppingIndent = Math.max(
        deepestDepth - legalDropDepthCount,
        this.indentation
      );
      let newParent = {
        parentLinearIndex: this.linearIndex,
        parent: this.targetItem,
      };
      for (let i = deepestDepth; i !== droppingIndent; i -= 1) {
        newParent = this.evaluator.getParentOfLinearItem(
          newParent.parentLinearIndex,
          this.treeId
        );
      }

      if (this.indentation !== treeLinearItems[this.linearIndex].depth) {
        this.targetItem = newParent.parent;
      }
    }

    const nextItem = this.env.linearItems[this.treeId][this.linearIndex + 1];
    const redirectToFirstChild =
      !this.env.canDropBelowOpenFolders &&
      nextItem &&
      this.targetItem.depth === nextItem.depth - 1 &&
      this.offset === 'bottom';
    if (redirectToFirstChild) {
      this.targetItem = nextItem;
      this.linearIndex += 1;
      this.offset = 'top';
    }

    const { depth } = this.targetItem;
    const targetItemData = this.env.items[this.targetItem.item];

    if (
      !this.offset &&
      !this.env.canDropOnNonFolder &&
      !targetItemData.isFolder
    ) {
      return undefined;
    }

    if (!this.offset && !this.env.canDropOnFolder && targetItemData.isFolder) {
      return undefined;
    }

    if (this.offset && !this.env.canReorderItems) {
      return undefined;
    }

    const { parent } = this.evaluator.getParentOfLinearItem(
      this.linearIndex,
      this.treeId
    );

    if (
      this.evaluator.draggingItems.some(
        draggingItem => draggingItem.index === this.targetItem.item
      )
    ) {
      return undefined;
    }

    const newChildIndex =
      this.env.items[parent.item].children!.indexOf(this.targetItem.item) +
      (this.offset === 'top' ? 0 : 1);

    if (
      this.offset === 'top' &&
      depth ===
        (this.env.linearItems[this.treeId][this.linearIndex - 1]?.depth ?? -1)
    ) {
      this.offset = 'bottom';
      this.linearIndex -= 1;
    }

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
    const { parentLinearIndex, parent } = this.evaluator.getParentOfLinearItem(
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
}
