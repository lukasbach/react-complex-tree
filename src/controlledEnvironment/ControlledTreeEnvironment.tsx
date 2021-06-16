import * as React from 'react';
import {
  ControlledTreeEnvironmentProps,
  DraggingPosition,
  TreeConfiguration,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';
import { useContext, useEffect, useState } from 'react';
import { createDefaultRenderers } from '../renderers/createDefaultRenderers';

export const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(null as any);

export const ControlledTreeEnvironment = <T extends any>(props: ControlledTreeEnvironmentProps<T>) => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [draggingItems, setDraggingItems] = useState<TreeItem<T>[]>();
  const [draggingPosition, setDraggingPosition] = useState<DraggingPosition>();
  const [itemHeight, setItemHeight] = useState(4);
  const [activeTree, setActiveTree] = useState<string>();

  useEffect(() => {
    const dragEndEventListener = () => {
      setDraggingPosition(undefined);
      setDraggingItems(undefined);

      console.log("DROP", draggingPosition, draggingItems, props.onDrop)
      if (draggingItems && draggingPosition && props.onDrop) {
        props.onDrop(draggingItems, draggingPosition);
      }
    };

    window.addEventListener('dragend', dragEndEventListener);

    return () => {
      window.removeEventListener('dragend', dragEndEventListener);
    }
  }, [draggingPosition, draggingItems, props.onDrop]);

  return (
    <TreeEnvironmentContext.Provider value={{
      ...createDefaultRenderers(props),
      ...props,
      registerTree: (tree) => {
        setTrees({...trees, [tree.treeId]: tree});
        props.onRegisterTree?.(tree);
      },
      unregisterTree: (treeId) => {
        props.onUnregisterTree?.(trees[treeId]);
        delete trees[treeId];
        setTrees(trees);
      },
      onStartDraggingItems: (items, treeId) => {
        setDraggingItems(items);
        console.log("ITEMS", items)
        const height = document.querySelector<HTMLElement>(`[data-rbt-item='${treeId}']`)?.offsetHeight ?? 5;
        console.log(`HEIGHT ${height}`, document.querySelector<HTMLElement>(`[data-rbt-item='${treeId}']`))
        setItemHeight(height);
      },
      draggingItems: draggingItems,
      itemHeight: itemHeight,
      onDragAtPosition: (position) => {
        setDraggingPosition(position);

        // if (position) {
        //   console.log(`Dragging in tree ${position.treeId} at item ${position.targetItem} at index ${position.childIndex}, linear index ${position.linearIndex}`);
        // }
      },
      draggingPosition: draggingPosition,
      activeTreeId: activeTree,
      setActiveTree: setActiveTree,
    }}>
      {props.children}
    </TreeEnvironmentContext.Provider>
  );
};
