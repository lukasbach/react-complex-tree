import * as React from 'react';
import {
  AllTreeRenderProps,
  ControlledTreeEnvironmentProps, DraggingPosition, TreeConfiguration, TreeInformation,
  TreeProps,
} from '../types';
import { HTMLProps, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeManager } from './TreeManager';

export const TreeRenderContext = React.createContext<AllTreeRenderProps>(null as any);
export const TreeConfigurationContext = React.createContext<TreeConfiguration>({
  treeId: '__no_tree',
  rootItem: '__no_tree',
});

export const Tree = <T extends any>(props: TreeProps<T>) => {
  const environment = useContext(TreeEnvironmentContext);
  const renderers = useMemo<AllTreeRenderProps>(() => ({ ...environment, ...props }), [props, environment]);
  const rootItem = environment.items[props.rootItem];

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

  return (
    <TreeRenderContext.Provider value={renderers}>
      <TreeConfigurationContext.Provider value={{ treeId: props.treeId, rootItem: props.rootItem }}>
        <TreeManager />
      </TreeConfigurationContext.Provider>
    </TreeRenderContext.Provider>
  );
};
