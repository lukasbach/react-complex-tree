import * as React from 'react';
import { ControlledTreeEnvironmentProps, TreeConfiguration, TreeEnvironmentContextProps, TreeItem } from '../types';
import { useContext, useState } from 'react';
import { createDefaultRenderers } from '../renderers/createDefaultRenderers';

export const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(null as any);

export const ControlledTreeEnvironment = <T extends any>(props: ControlledTreeEnvironmentProps<T>) => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [draggingItems, setDraggingItems] = useState<TreeItem<T>[]>();
  const [itemHeight, setItemHeight] = useState(4);
  
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
        const height = document.querySelector(`[data-rbt-item='${treeId}']`)?.clientHeight ?? 5;
        setItemHeight(height);
      },
      draggingItems: draggingItems,
      itemHeight: itemHeight,
    }}>
      {props.children}
    </TreeEnvironmentContext.Provider>
  );
};
