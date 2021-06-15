import { TreeItemIndex, TreeProps } from './types';
import { Draggable } from 'react-beautiful-dnd';
import React, { useContext, useMemo } from 'react';
import { TreeEnvironmentContext } from './ControlledTreeEnvironment';
import { createTreeItemRenderContext, createTreeItemRenderContextDependencies } from './helpers';
import { TreeItemChildren } from './TreeItemChildren';

export const TreeItem = <T extends any>(props: {
  itemIndex: TreeItemIndex;
  depth: number;
}) => {
  const environment = useContext(TreeEnvironmentContext);
  const item = environment.items[props.itemIndex];
  const isExpanded = useMemo(() => environment.expandedItems?.includes(props.itemIndex), [props.itemIndex, environment.expandedItems]);
  const actions = useMemo(
    () => createTreeItemRenderContext(item, environment),
    createTreeItemRenderContextDependencies(item, environment)
  );


  return (
    <>
      {environment.renderItem(environment.items[props.itemIndex], props.depth, actions, {})}
      {item.hasChildren && isExpanded && item.children && (
        <TreeItemChildren depth={props.depth + 1} parentId={props.itemIndex} children={item.children} />
      )}
    </>
  )
}