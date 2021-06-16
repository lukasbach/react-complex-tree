import * as React from 'react';
import {
  AllTreeRenderProps,
  ControlledTreeEnvironmentProps, TreeInformation,
  TreeItemIndex,
  TreeProps,
  TreeRenderProps,
} from '../types';
import { HTMLProps, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItemChildren } from './TreeItemChildren';
import { createTreeInformation, createTreeInformationDependencies, getItemsLinearly } from '../helpers';
import { useViewState } from './useViewState';
import { DragBetweenLine } from './DragBetweenLine';
import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useFocusWithin } from './useFocusWithin';

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

  useFocusWithin(containerRef.current, () => {
    environment.setActiveTree(props.treeId)
  }, () => {
    if (environment.activeTreeId === props.treeId) {
      environment.setActiveTree(undefined);
    }
  }, [environment.activeTreeId, props.treeId]);

  const treeInformation = useMemo(
    () => createTreeInformation(environment, props.treeId),
    createTreeInformationDependencies(environment, props.treeId),
  ); // share with tree children

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
    onDragOver: e => {
      console.log("DRAG", props.treeId)
      if (!containerRef.current) {
        return;
      }

      if (e.clientX < 0 || e.clientY < 0) {
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

      if (hoveringPosition % 1 < .2) {
        offset = 'top';
      } else if (hoveringPosition % 1 > .8) {
        offset = 'bottom';
      } else {
      }

      const hoveringCode = outsideContainer ? 'outside' : `${linearIndex}${offset ?? ''}`;

      if (lastHoverCode.current !== hoveringCode) {
        lastHoverCode.current = hoveringCode;

        if (outsideContainer) {
          console.log("Dragged outside of container", e.clientX, e.clientY, treeBb);
          environment.onDragAtPosition(undefined);
          return;
        }

        const linearItems = getItemsLinearly(props.rootItem, environment.viewState[props.treeId] ?? {}, environment.items);

        if (linearIndex < 0 || linearIndex >= linearItems.length) {
          console.log("Dragged outside linear list");
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

        if (environment.viewState[props.treeId]?.selectedItems?.includes(linearItems[linearIndex].item)) {
          return;
        }

        if (offset) {
          environment.onDragAtPosition({
            targetType: 'between-items',
            treeId: props.treeId,
            parentItem: parent.item,
            depth: linearItems[linearIndex].depth,
            linearIndex: linearIndex + (offset === 'top' ? 0 : 1),
            childIndex: linearIndex - parentLinearIndex - 1 + (offset === 'top' ? 0 : 1),
            linePosition: offset,
          });
        } else {
          environment.onDragAtPosition({
            targetType: 'item',
            treeId: props.treeId,
            parentItem: parent.item,
            targetItem: linearItems[linearIndex].item,
            depth: linearItems[linearIndex].depth,
            linearIndex: linearIndex,
          })
        }

        // if (environment.activeTreeId !== props.treeId) {
          environment.setActiveTree(props.treeId);

          if (environment.draggingItems && environment.onSelectItems && environment.activeTreeId !== props.treeId) {
            environment.onSelectItems(environment.draggingItems.map(item => item.index), props.treeId);
          }
        // }
      }
    },
    ref: containerRef,
    style: { position: 'relative' }
  };

  return (
    <TreeRenderContext.Provider value={renderers}>
      <TreeIdContext.Provider value={props.treeId}>
        {renderers.renderTreeContainer(treeChildren, containerProps, treeInformation)}
      </TreeIdContext.Provider>
    </TreeRenderContext.Provider>
  );
};
