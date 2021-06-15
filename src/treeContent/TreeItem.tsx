import { TreeItemIndex, TreeProps } from '../types';
import React, { useContext, useMemo } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { createTreeItemRenderContext, createTreeItemRenderContextDependencies } from '../helpers';
import { TreeItemChildren } from './TreeItemChildren';
import { TreeIdContext } from './Tree';
import { useViewState } from './useViewState';

export const TreeItem = <T extends any>(props: {
  itemIndex: TreeItemIndex;
  depth: number;
}) => {
  const treeId = useContext(TreeIdContext);
  const environment = useContext(TreeEnvironmentContext);
  const viewState = useViewState();
  const item = environment.items[props.itemIndex];

  const isExpanded = useMemo(() => viewState.expandedItems?.includes(props.itemIndex), [props.itemIndex, viewState.expandedItems]);
  const actions = useMemo(
    () => item && createTreeItemRenderContext(item, environment, treeId),
    createTreeItemRenderContextDependencies(item, environment, treeId)
  );

  if (item === undefined) {
    environment.onMissingItems?.([props.itemIndex]);
    return null;
  }


  return (
    <>
      {environment.renderItem(environment.items[props.itemIndex], props.depth, actions, {})}
      {item.hasChildren && isExpanded && item.children && (
        <TreeItemChildren depth={props.depth + 1} parentId={props.itemIndex} children={item.children} />
      )}
    </>
  )
}