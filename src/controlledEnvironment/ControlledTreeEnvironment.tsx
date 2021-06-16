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

  useEffect(() => {
    const dragEndEventListener = () => {
      console.log("MOUSE UP")
      setDraggingPosition(undefined);
      setDraggingItems(undefined);
    };

    window.addEventListener('dragend', dragEndEventListener);

    return () => {
      window.removeEventListener('dragend', dragEndEventListener);
    }
  }, [])

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
        const height = document.querySelector<HTMLElement>(`[data-rbt-item='${treeId}']`)?.offsetHeight ?? 5;
        console.log(`HEIGHT ${height}`, document.querySelector<HTMLElement>(`[data-rbt-item='${treeId}']`))
        setItemHeight(height);
      },
      draggingItems: draggingItems,
      itemHeight: itemHeight,
      onDragAtPosition: (treeId, targetItem, childIndex, linearIndex) => {
        console.log(`Dragging in tree ${treeId} at item ${targetItem} at index ${childIndex} ${itemHeight}`);

        if (!targetItem) {
          setDraggingPosition(undefined);
        } else {
          setDraggingPosition({ treeId, targetItem, childIndex, linearIndex });
        }
      },
      draggingPosition
    }}>
      {props.children}
    </TreeEnvironmentContext.Provider>
  );
};
