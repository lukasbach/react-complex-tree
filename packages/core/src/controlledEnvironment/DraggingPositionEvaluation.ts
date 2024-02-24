import {
  DraggingPositionEvaluator,
  HoveringPosition,
} from './DraggingPositionEvaluator';
import {
  DraggingPosition,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';

export class DraggingPositionEvaluation {
  private readonly evaluator: DraggingPositionEvaluator;

  private readonly env: TreeEnvironmentContextProps;

  private readonly e: DragEvent;

  private readonly treeId: string;

  private readonly hoveringPosition: HoveringPosition;

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
    this.hoveringPosition = hoveringPosition;
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

    // eslint-disable-next-line prefer-const
    let { linearIndex, offset, veryBottom } = this.hoveringPosition;

    if (
      linearIndex < 0 ||
      linearIndex >= this.env.linearItems[this.treeId].length
    ) {
      return undefined;
    }

    let targetItem = this.env.linearItems[this.treeId][linearIndex];
    const redirectTargetToParent =
      !this.env.canReorderItems &&
      !this.env.canDropOnNonFolder &&
      !this.env.items[targetItem.item].isFolder;

    if (redirectTargetToParent) {
      const { parentLinearIndex, parent } =
        this.evaluator.getParentOfLinearItem(linearIndex, this.treeId);
      targetItem = parent;
      linearIndex = parentLinearIndex;
    }

    if (
      this.isDescendant(this.treeId, linearIndex, this.evaluator.draggingItems)
    ) {
      return undefined;
    }

    const nextItem = this.env.linearItems[this.treeId][linearIndex + 1];
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

    const { parent } = this.evaluator.getParentOfLinearItem(
      linearIndex,
      this.treeId
    );

    if (
      this.evaluator.draggingItems.some(
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
      depth ===
        (this.env.linearItems[this.treeId][linearIndex - 1]?.depth ?? -1)
    ) {
      offset = 'bottom';
      linearIndex -= 1;
    }

    if (veryBottom) {
      const { rootItem } = this.env.trees[this.treeId];
      return {
        targetType: 'between-items',
        treeId: this.treeId,
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
        treeId: this.treeId,
        parentItem: parent.item,
        depth: targetItem.depth,
        linearIndex: linearIndex + (offset === 'top' ? 0 : 1),
        childIndex: newChildIndex,
        linePosition: offset,
      };
    }
    return {
      targetType: 'item',
      treeId: this.treeId,
      parentItem: parent.item,
      targetItem: targetItem.item,
      depth: targetItem.depth,
      linearIndex,
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
