import * as React from 'react';
import { ControlledTreeEnvironmentProps, TreeProps, TreeRenderProps } from './types';
import { useContext, useEffect, useMemo } from 'react';
import { TreeEnvironmentContext } from './ControlledTreeEnvironment';
import { Droppable } from 'react-beautiful-dnd';
import { TreeItemChildren } from './TreeItemChildren';

export const TreeRenderContext = React.createContext<TreeRenderProps>(null as any);

export const Tree = <T extends any>(props: TreeProps<T>) => {
  const environment = useContext(TreeEnvironmentContext);
  const renderers = useMemo<TreeRenderProps>(() => ({ ...environment, ...props }), [props, environment]);

  const rootChildren = environment.data.items[props.rootItem].children!;

  useEffect(() => {
    environment.registerTree({
      treeId: props.treeId,
      rootItem: props.rootItem
    });

    return () => environment.unregisterTree(props.treeId);
  }, [ props.treeId, props.rootItem ]);

  return (
    <TreeRenderContext.Provider value={renderers}>
      <Droppable droppableId={props.treeId}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <TreeItemChildren children={rootChildren} depth={0} indexOffset={0} parentPath={[props.treeId]} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </TreeRenderContext.Provider>
  );
};
