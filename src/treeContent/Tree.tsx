import * as React from 'react';
import {
  AllTreeRenderProps,
  ControlledTreeEnvironmentProps,
  TreeItemIndex,
  TreeProps,
  TreeRenderProps,
} from '../types';
import { HTMLProps, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItemChildren } from './TreeItemChildren';
import { getItemsLinearly } from '../helpers';
import { useViewState } from './useViewState';
import { DragBetweenLine } from './DragBetweenLine';

export const TreeRenderContext = React.createContext<AllTreeRenderProps>(null as any);
export const TreeIdContext = React.createContext<string>('__no_tree');

export const Tree = <T extends any>(props: TreeProps<T>) => {
  const environment = useContext(TreeEnvironmentContext);
  const renderers = useMemo<AllTreeRenderProps>(() => ({ ...environment, ...props }), [props, environment]);
  const rootItem = environment.items[props.rootItem];
  const containerRef = useRef<HTMLElement>();
  const lastHoverCode = useRef<string>();
 // const itemIdsLinearly = useRef<TreeItemIndex[]>();

 // useEffect(() => {
 //   // TODO only when drag starts
 //   setTimeout(() => {
 //     console.log("Update linear item ids")
 //     itemIdsLinearly.current = getItemsLinearly(props.rootItem, environment.viewState[props.treeId], environment.items);
 //     console.log(itemIdsLinearly)
 //   })
 // }, [environment.viewState[props.treeId]])

  useEffect(() => {
    environment.registerTree({
      treeId: props.treeId,
      rootItem: props.rootItem
    });

    return () => environment.unregisterTree(props.treeId);
  }, [ props.treeId, props.rootItem ]);

  if (rootItem === undefined) {
    environment.onMissingItems?.([props.rootItem]);
    return null;
  }

  const rootChildren = rootItem.children;

  if (!rootChildren) {
    throw Error(`Root ${props.rootItem} does not contain any children`);
  }

  const treeChildren = (
    <React.Fragment>
      <TreeItemChildren children={rootChildren} depth={0} parentId={props.treeId} />
      <DragBetweenLine treeId={props.treeId} />
    </React.Fragment>
  );

  const containerProps: HTMLProps<any> = {
    onDrag: e => {
      const hoveringPosition = (e.clientY - containerRef.current!.offsetTop) / environment.itemHeight;
      let linearIndex = Math.floor(hoveringPosition);
      let offset: 'top' | 'bottom' | undefined = undefined;

      if (hoveringPosition % 1 < .2) {
        offset = 'top';
      } else if (hoveringPosition % 1 > .8) {
        offset = 'bottom';

        // offset = 'top';
        // linearIndex =- 1;
      } else {
      }

      const hoveringCode = `${linearIndex}${offset ?? ''}`;

      if (lastHoverCode.current !== hoveringCode) {
        lastHoverCode.current = hoveringCode;
        const linearItems = getItemsLinearly(props.rootItem, environment.viewState[props.treeId], environment.items);

        console.log(linearIndex, hoveringPosition, e.clientY, containerRef.current?.offsetTop, environment.itemHeight, containerRef.current)
        if (linearIndex < 0 || linearIndex >= linearItems.length) {
          environment.onDragAtPosition(undefined);
          return;
        }

        const depth = linearItems[linearIndex].depth;
        let parentLinearIndex = linearIndex;
        for (; !!linearItems[parentLinearIndex] && linearItems[parentLinearIndex].depth !== depth - 1; parentLinearIndex--);

        let parent = linearItems[parentLinearIndex];

        if (!parent) {
          parent = { item: props.rootItem, depth: 0 };
          parentLinearIndex = 0;
        }

        if (environment.viewState[props.treeId].selectedItems?.includes(linearItems[linearIndex].item)) {
          return;
        }

        if (offset) {
          environment.onDragAtPosition({
            treeId: props.treeId,
            targetItem: parent.item,
            depth: linearItems[linearIndex].depth,
            linearIndex: linearIndex + (offset === 'top' ? 0 : 1),
            childIndex: linearIndex - parentLinearIndex + (offset === 'top' ? 0 : 1),
            linePosition: offset,
          });
        } else {
          environment.onDragAtPosition({
            treeId: props.treeId,
            targetItem: linearItems[linearIndex].item,
            depth: linearItems[linearIndex].depth,
            linearIndex: linearIndex,
            childIndex: undefined,
          })
        }


        // console.log(linearItems[linearIndex].item, parent.item, offset)

        // environment.onDragAtPosition(
        //   props.treeId,
        //   !!offset ? parent.item : linearItems[linearIndex].item,
        //   !!offset ? linearIndex - parentLinearIndex : undefined,
        //   linearIndex
        // );
      }
    },
    ref: containerRef,
    style: { position: 'relative' }
  };

  return (
    <TreeRenderContext.Provider value={renderers}>
      <TreeIdContext.Provider value={props.treeId}>
        {renderers.renderTreeContainer(treeChildren, containerProps)}
      </TreeIdContext.Provider>
    </TreeRenderContext.Provider>
  );
};
