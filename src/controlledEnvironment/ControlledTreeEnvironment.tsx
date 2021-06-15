import * as React from 'react';
import { ControlledTreeEnvironmentProps, TreeConfiguration, TreeEnvironmentContextProps, TreeItem } from '../types';
import { useContext, useState } from 'react';
import { createDefaultRenderers } from '../renderers/createDefaultRenderers';

export const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(null as any);

export const ControlledTreeEnvironment = <T extends any>(props: ControlledTreeEnvironmentProps<T>) => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [isDragging, setIsDragging] = useState(false);
  
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
      onStartDraggingSelectedItems: () => setIsDragging(true),
      isDragging: isDragging,
    }}>
      {props.children}
    </TreeEnvironmentContext.Provider>
  );
};
