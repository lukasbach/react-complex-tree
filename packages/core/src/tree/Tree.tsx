import * as React from 'react';
import { AllTreeRenderProps, TreeContextProps, TreeItemIndex, TreeProps, TreeRef } from '../types';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeManager } from './TreeManager';
import { useCreatedTreeInformation } from './useCreatedTreeInformation';
import { getItemsLinearly } from './getItemsLinearly';
import { TreeActionsProvider } from '../treeActions/TreeActionsProvider';

const TreeContext = React.createContext<TreeContextProps>(null as any); // TODO default value

export const useTree = () => useContext(TreeContext);

export const Tree = React.forwardRef<TreeRef, TreeProps>((props, ref) => {
  const environment = useTreeEnvironment();
  const renderers = useMemo<AllTreeRenderProps>(() => ({ ...environment, ...props }), [props, environment]);
  const [search, setSearch] = useState<string | null>(null);
  const [renamingItem, setRenamingItem] = useState<TreeItemIndex | null>(null);
  const rootItem = environment.items[props.rootItem];
  const viewState = environment.viewState[props.treeId] ?? {};

  useEffect(() => {
    environment.registerTree({
      treeId: props.treeId,
      rootItem: props.rootItem,
    });

    return () => environment.unregisterTree(props.treeId);
  }, [props.treeId, props.rootItem]);

  const treeInformation = useCreatedTreeInformation(props, renamingItem, search);

  const treeContextProps: TreeContextProps = {
    treeId: props.treeId,
    rootItem: props.rootItem,
    treeLabel: props.treeLabel,
    treeLabelledBy: props.treeLabelledBy,
    getItemsLinearly: () => getItemsLinearly(props.rootItem, viewState, environment.items),
    treeInformation,
    search,
    setSearch,
    renamingItem,
    setRenamingItem,
    renderers,
  };

  if (rootItem === undefined) {
    environment.onMissingItems?.([props.rootItem]);
    return null;
  }

  return (
    <TreeContext.Provider value={treeContextProps}>
      <TreeActionsProvider ref={ref}>
        <TreeManager />
      </TreeActionsProvider>
    </TreeContext.Provider>
  );
}) as <T = any>(p: TreeProps<T> & { ref?: React.Ref<TreeRef<T>> }) => React.ReactElement;
