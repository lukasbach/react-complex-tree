import { TreeItemIndex, TreeProps } from '../types';
import React, { useContext, useMemo, useState } from 'react';
import { TreeItemChildren } from './TreeItemChildren';
import { useViewState } from '../tree/useViewState';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useTreeItemRenderContext } from './useTreeItemRenderContext';

export const TreeItem = <T extends any>(props: {
  itemIndex: TreeItemIndex;
  depth: number;
}): JSX.Element => {
  const [hasBeenRequested, setHasBeenRequested] = useState(false);
  const { renderers, treeInformation } = useTree();
  const environment = useTreeEnvironment();
  const viewState = useViewState();
  const item = environment.items[props.itemIndex];

  const isExpanded = useMemo(
    () => viewState.expandedItems?.includes(props.itemIndex),
    [props.itemIndex, viewState.expandedItems]
  );

  // Safely assume that renderContext exists, because if not, item also does not exist and the
  // component will exit early anyways
  const renderContext = useTreeItemRenderContext(item)!;

  if (item === undefined) {
    if (!hasBeenRequested) {
      setHasBeenRequested(true);
      environment.onMissingItems?.([props.itemIndex]);
    }
    return null as any;
  }

  const children = item.hasChildren && isExpanded && item.children && (
    <TreeItemChildren depth={props.depth + 1} parentId={props.itemIndex} children={item.children} />
  );

  const title = environment.getItemTitle(item);
  const titleComponent = renderers.renderItemTitle(title, item, renderContext, treeInformation);

  return (
    renderers.renderItem(
      environment.items[props.itemIndex],
      props.depth,
      children,
      titleComponent,
      renderContext,
      treeInformation
    ) ?? null
  ) as any; // Type to use AllTreeRenderProps
}