import { DraggingPosition } from '../types';
import * as React from 'react';
import { TreeItemChildren } from '../treeItem/TreeItemChildren';
import { DragBetweenLine } from './DragBetweenLine';
import { HTMLProps, useContext, useMemo, useRef } from 'react';
import { useFocusWithin } from './useFocusWithin';
import { useGetLinearItems } from './useGetLinearItems';
import { useTreeKeyboardBindings } from './useTreeKeyboardBindings';
import { SearchInput } from '../search/SearchInput';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export const TreeManager = <T extends any>(props: {}): JSX.Element => {
  const { treeId, rootItem, renderers, treeInformation } = useTree();
  const environment = useTreeEnvironment();
  const containerRef = useRef<HTMLElement>();
  const lastHoverCode = useRef<string>();
  const getLinearItems = useGetLinearItems();
  const isActiveTree = environment.activeTreeId === treeId;

  useTreeKeyboardBindings(containerRef.current);

  useFocusWithin(containerRef.current, () => {
    environment.setActiveTree(treeId);
    console.log(`focus in for ${treeId}, previous was ${environment.activeTreeId}`, document.activeElement)
  }, () => {
    if (isActiveTree) {
      console.log(`Focusout, is active tree: ${isActiveTree?1:0}, ${environment.activeTreeId} for tree ${treeId}`, document.activeElement)
      environment.setActiveTree(undefined);
    }
  }, [environment.activeTreeId, treeId, isActiveTree]);

  const rootChildren = environment.items[rootItem].children;

  if (!rootChildren) {
    throw Error(`Root ${rootItem} does not contain any children`);
  }

  const treeChildren = (
    <React.Fragment>
      <TreeItemChildren children={rootChildren} depth={0} parentId={treeId} />
      <DragBetweenLine treeId={treeId} />
      <SearchInput containerRef={containerRef.current} />
    </React.Fragment>
  );

  const containerProps: HTMLProps<any> = {
    onDragOver: e => {
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
      const outsideContainer = e.clientX < treeBb.left
        || e.clientX > treeBb.right
        || e.clientY < treeBb.top
        || e.clientY > treeBb.bottom; // TODO hotfix

      // console.log(outsideContainer, treeBb, e.clientX, e.clientY);

      const hoveringPosition = (e.clientY- /*containerRef.current!.offsetTop*/ treeBb.top) / environment.itemHeight;
      let linearIndex = Math.floor(hoveringPosition);
      let offset: 'top' | 'bottom' | undefined = undefined;

      const lineThreshold = (environment.allowDropOnItemWithChildren || environment.allowDropOnItemWithoutChildren) ? .2 : .5;

      if (hoveringPosition % 1 < lineThreshold) {
        offset = 'top';
      } else if (hoveringPosition % 1 > 1 - lineThreshold) {
        offset = 'bottom';
      } else {
      }

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
            childIndex: linearIndex - parentLinearIndex - 1 + (offset === 'top' ? 0 : 1),
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
          console.log("Drag aborted due to canDropAt hook");
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
    },
    ref: containerRef,
    style: { position: 'relative' },
    ...({
      ['data-rbt-tree']: treeId,
    } as any)
  };

  return renderers.renderTreeContainer(treeChildren, containerProps, treeInformation) as JSX.Element;
}