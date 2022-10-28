import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import {
  AllTreeRenderProps,
  TreeContextProps,
  TreeItemIndex,
  TreeProps,
  TreeRef,
} from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeManager } from './TreeManager';
import { useCreatedTreeInformation } from './useCreatedTreeInformation';
import { getItemsLinearly } from './getItemsLinearly';
import { TreeActionsProvider } from '../treeActions/TreeActionsProvider';

const TreeContext = React.createContext<TreeContextProps>(null as any); // TODO default value

export const useTree = () => useContext(TreeContext);

export const Tree = React.forwardRef<TreeRef, TreeProps>((props, ref) => {
  const environment = useTreeEnvironment();
  const renderers = useMemo<AllTreeRenderProps>(
    () => ({ ...environment, ...props }),
    [props, environment]
  );
  const [search, setSearch] = useState<string | null>(null);
  const [renamingItem, setRenamingItem] = useState<TreeItemIndex | null>(null);
  const rootItem = environment.items[props.rootItem];
  const viewState = environment.viewState[props.treeId];

  useEffect(() => {
    environment.registerTree({
      treeId: props.treeId,
      rootItem: props.rootItem,
    });

    return () => environment.unregisterTree(props.treeId);
    // TODO should be able to remove soon, and add environment.registerTree, environment.unregisterTree as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.treeId, props.rootItem]);

  const treeInformation = useCreatedTreeInformation(
    props,
    renamingItem,
    search
  );

  const treeContextProps = useMemo<TreeContextProps>(
    () => ({
      treeId: props.treeId,
      rootItem: props.rootItem,
      treeLabel: props.treeLabel,
      treeLabelledBy: props.treeLabelledBy,
      getItemsLinearly: () =>
        getItemsLinearly(props.rootItem, viewState ?? {}, environment.items),
      treeInformation,
      search,
      setSearch,
      renamingItem,
      setRenamingItem,
      renderers,
    }),
    [
      environment.items,
      props.rootItem,
      props.treeId,
      props.treeLabel,
      props.treeLabelledBy,
      renamingItem,
      renderers,
      search,
      treeInformation,
      viewState,
    ]
  );

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
}) as <T = any>(
  p: TreeProps<T> & { ref?: React.Ref<TreeRef<T>> }
) => React.ReactElement;
