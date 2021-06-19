import * as React from 'react';
import {
  AllTreeRenderProps,
  ControlledTreeEnvironmentProps, DraggingPosition, TreeConfiguration, TreeContextProps, TreeInformation,
  TreeProps,
} from '../types';
import { HTMLProps, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeManager } from './TreeManager';
import { createTreeInformation, createTreeInformationDependencies } from '../helpers';

const TreeContext = React.createContext<TreeContextProps>(null as any); // TODO default value

export const useTree = () => useContext(TreeContext);

export const Tree = <T extends any>(props: TreeProps<T>) => {
  const environment = useTreeEnvironment();
  const renderers = useMemo<AllTreeRenderProps>(() => ({ ...environment, ...props }), [props, environment]);
  const rootItem = environment.items[props.rootItem];
  const [search, setSearch] = useState<string | null>(null);

  useEffect(() => {
    environment.registerTree({
      treeId: props.treeId,
      rootItem: props.rootItem
    });

    return () => environment.unregisterTree(props.treeId);
  }, [ props.treeId, props.rootItem ]);

  const treeInformation = useMemo(
    () => createTreeInformation(environment, props.treeId, search),
    createTreeInformationDependencies(environment, props.treeId, search),
  ); // TODO share with tree children

  if (rootItem === undefined) {
    environment.onMissingItems?.([props.rootItem]);
    return null;
  }

  return (
    <TreeContext.Provider value={{
      treeId: props.treeId,
      rootItem: props.rootItem,
      treeInformation,
      search,
      setSearch,
      renderers,
    }}>
      <TreeManager />
    </TreeContext.Provider>
  );
};