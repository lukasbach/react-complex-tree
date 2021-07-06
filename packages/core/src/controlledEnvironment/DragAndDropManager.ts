import { DraggingPosition, TreeCapabilities, TreeEnvironmentContextProps } from '../types';
import * as React from 'react';
import { getItemsLinearly } from '../tree/getItemsLinearly';
/*
export class DragAndDropManager {
  private environment!: TreeEnvironmentContextProps;
  private lastDragCode = '_nodrag';

  constructor() {
  }

  public useUpdatedEnvironmentProps(environment: TreeEnvironmentContextProps) {
    React.useEffect(() => {
      this.environment = environment;
    }, [environment]);
  }

  public getViableDragPositions(treeId: string) {
    const linearItems = this.getLinearItems(treeId);
    const positions = linearItems
      .map<DraggingPosition[]>(({ item, depth }, linearIndex) => {
        const parent = this.getParentOfLinearItem(linearItems, linearIndex, treeId);
        const childIndex = this.environment.items[parent.item].children!.indexOf(item);

        const itemPosition: DraggingPosition = {
          targetType: 'item',
          parentItem: parent.item,
          targetItem: item,
          linearIndex,
          depth,
          treeId,
        };

        const topPosition: DraggingPosition = {
          targetType: 'between-items',
          parentItem: parent.item,
          linePosition: 'top',
          childIndex,
          depth,
          treeId,
          linearIndex,
        };

        const bottomPosition: DraggingPosition = {
          targetType: 'between-items',
          parentItem: parent.item,
          linePosition: 'bottom',
          linearIndex: linearIndex + 1,
          childIndex,
          depth,
          treeId,
        };

        const skipTopPosition = depth === (linearItems[linearIndex - 1]?.depth ?? -1);

        if (skipTopPosition) {
          return [itemPosition, bottomPosition];
        } else {
          return [topPosition, itemPosition, bottomPosition];
        }
      })
      .reduce((a, b) => [...a, ...b], [])
      .filter((position) => this.canDropAt(position));

    return positions;
  }

  // TODO other approach: Store linear list of possible drag positions when drag starts, then just iterate on keyboard event
  // TODO Also use this list during actual drag
  public getNextProgrammaticDragPosition(treeId: string, currentPosition?: DraggingPosition): DraggingPosition {
    const linearItems = this.getLinearItems(treeId);
    currentPosition = currentPosition ?? this.environment.draggingPosition;
    let nextPosition: DraggingPosition;

    if (!currentPosition) {
      // Try between-items position first. If that's not allowed, getNextProgrammaticDragPosition will
      // try the next item position next.
      nextPosition = {
        targetType: 'between-items',
        parentItem: this.environment.trees[treeId].rootItem,
        depth: linearItems[0].depth,
        linePosition: 'top',
        childIndex: 0,
        linearIndex: 0,
        treeId,
      };

      if (this.canDropAt(nextPosition)) {
        console.log("Initial Pos", currentPosition, nextPosition)
        return nextPosition;
      } else {
        return this.getNextProgrammaticDragPosition(treeId, nextPosition);
      }
    }

    if (currentPosition.targetType === 'between-items' && currentPosition.linePosition === 'top') {
      // Top line
      console.log("Top Line")
      nextPosition = {
        targetType: 'item',
        treeId,
        linearIndex: currentPosition.linearIndex,
        depth: currentPosition.depth,
        targetItem: linearItems[currentPosition.linearIndex].item,
        parentItem: currentPosition.parentItem,
      };
    } else if (currentPosition.targetType === 'item') {
      // Between lines, i.e. dragging over item
      console.log("Between lines, i.e. dragging over item", currentPosition.targetItem, this.environment.items[currentPosition.parentItem].children)
      const childIndex = this.environment.items[currentPosition.parentItem].children!.indexOf(currentPosition.targetItem);
      nextPosition = {
        targetType: 'between-items',
        treeId,
        linearIndex: currentPosition.linearIndex,
        depth: currentPosition.depth,
        parentItem: currentPosition.parentItem,
        linePosition: 'bottom',
        childIndex,
      };
    } else {
      // Bottom line
      console.log("Bottom Line")
      const nextIndex = currentPosition.linearIndex + 1 > linearItems.length - 1 ? 0 : currentPosition.linearIndex + 1;
      const childIndex = this.environment.items[currentPosition.parentItem].children!.indexOf(linearItems[nextIndex].item);
      nextPosition = {
        targetType: 'between-items',
        treeId,
        linearIndex: nextIndex + 1,
        linePosition: 'top',
        depth: linearItems[nextIndex].depth,
        parentItem: this.getParentOfLinearItem(linearItems, nextIndex, treeId).item,
        childIndex,
      };
    }

    if (nextPosition.targetType === 'between-items' && nextPosition.linePosition === 'top' && nextPosition.depth === (linearItems[nextPosition.linearIndex - 1]?.depth ?? -1)) {
      nextPosition.linePosition = 'bottom';
      nextPosition.linearIndex -= 1;
    }

    console.log(currentPosition, nextPosition)

    return nextPosition;
  }

  public handleProgrammaticDndArrowUp() {
    const treeId = this.environment.activeTreeId;

    if (!treeId) {
      return;
    }

    const pos = this.getViableDragPositions(treeId);
    let c = 0;
    setInterval(() => {
      this.performDrag(pos[c]);
      c++;
      if (c > pos.length - 1) c = 0;
    }, 500)
  }

  public handleProgrammaticDndArrowDown() {
    const treeId = this.environment.activeTreeId;

    if (!treeId) {
      return;
    }

    const nextPosition = this.getNextProgrammaticDragPosition(treeId);
    this.performDrag(nextPosition);
  }

  public onDrag(e: DragEvent, treeId: string, containerRef: React.MutableRefObject<HTMLElement | undefined>) {
    if (!this.environment.canDragAndDrop) {
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
    const outsideContainer = this.isOutsideOfContainer(e, treeBb);

    // console.log(outsideContainer, treeBb, e.clientX, e.clientY);

    let { linearIndex, offset } = this.getHoveringPosition(e.clientY, treeBb.top, this.environment.itemHeight, this.environment);

    const nextDragCode = outsideContainer ? 'outside' : `${linearIndex}${offset ?? ''}`;

    if (this.lastDragCode === nextDragCode) {
      return;
    }

    this.lastDragCode = nextDragCode;

    if (outsideContainer) {
      this.environment.onDragAtPosition(undefined);
      // console.log("Drag aborted due to being out of container");
      return;
    }

    const linearItems = this.getLinearItems(treeId);

    if (linearIndex < 0 || linearIndex >= linearItems.length) {
      this.environment.onDragAtPosition(undefined);
      // console.log("Drag aborted due to being out of linear list");
      return;
    }

    const targetItem = linearItems[linearIndex];
    const depth = targetItem.depth;
    const targetItemData = this.environment.items[targetItem.item];

    if (!offset && !this.environment.canDropOnItemWithoutChildren && !targetItemData.hasChildren) {
      this.environment.onDragAtPosition(undefined);
      // console.log("Drag aborted due to canDropOnItemWithoutChildren");
      return;
    }

    if (!offset && !this.environment.canDropOnItemWithChildren && targetItemData.hasChildren) {
      this.environment.onDragAtPosition(undefined);
      // console.log("Drag aborted due to canDropOnItemWithChildren");
      return;
    }

    if (offset && !this.environment.canReorderItems) {
      this.environment.onDragAtPosition(undefined);
      // console.log("Drag aborted due to canReorderItems");
      return;
    }

    let parent = this.getParentOfLinearItem(linearItems, linearIndex, treeId);

    if (this.environment.viewState[treeId]?.selectedItems?.includes(targetItem.item)) {
      return;
    }

    const newChildIndex = this.environment.items[parent.item].children!.indexOf(targetItem.item) + (offset === 'top' ? 0 : 1);

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

    this.performDrag(draggingPosition);
  }

  public canDropAt(draggingPosition: DraggingPosition) {
    if (!this.environment.canReorderItems && draggingPosition.targetType === 'between-items') {
      return false;
    }

    // TODO test canDropOnItemWithChildren

    if (this.environment.canDropAt && (!this.environment.draggingItems
      || !this.environment.canDropAt(this.environment.draggingItems, draggingPosition))) {
      this.environment.onDragAtPosition(undefined);
      return false;
    }

    return true;
  }

}*/