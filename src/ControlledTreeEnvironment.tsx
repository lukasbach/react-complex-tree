import * as React from 'react';
import { ControlledTreeEnvironmentProps, TreeConfiguration, TreeEnvironmentContextProps } from './types';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from 'react';

export const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(null as any);

export const ControlledTreeEnvironment = <T extends any>(props: ControlledTreeEnvironmentProps<T>) => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({})

  return (
    <TreeEnvironmentContext.Provider value={{
      ...props,
      registerTree: (tree) => {
        setTrees({...trees, [tree.treeId]: tree});
      },
      unregisterTree: (treeId) => {
        delete trees[treeId];
        setTrees(trees);
      },
    }}>
      <DragDropContext
        onDragStart={(initial, provided) => {
        }}
        onDragEnd={(result, provided) => {
        }}
      >
        {props.children}
      </DragDropContext>
    </TreeEnvironmentContext.Provider>
  );
};
