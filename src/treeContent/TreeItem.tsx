import { TreeItemIndex, TreeProps } from '../types';
import React, { useContext, useMemo, useState } from 'react';
import {
  createTreeInformation, createTreeInformationDependencies,
  createTreeItemRenderContext,
  createTreeItemRenderContextDependencies,
} from '../helpers';
import { TreeItemChildren } from './TreeItemChildren';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export const TreeItem = <T extends any>(props: {
  itemIndex: TreeItemIndex;
  depth: number;
}): JSX.Element => {
  const [hasBeenRequested, setHasBeenRequested] = useState(false);
  const { treeId, renderers, search } = useTree();
  const environment = useTreeEnvironment();
  const viewState = useViewState();
  const item = environment.items[props.itemIndex];

  const isExpanded = useMemo(() => viewState.expandedItems?.includes(props.itemIndex), [props.itemIndex, viewState.expandedItems]);

  const isSearchMatching = useMemo(() => {
    return search === null || search.length === 0 || !item ? false : environment.doesSearchMatchItem?.(search, item)
      ?? environment.getItemTitle(item).toLowerCase().includes(search.toLowerCase());
  }, [search]);

  const renderContext = useMemo(
    () => item && createTreeItemRenderContext(item, environment, treeId, isSearchMatching),
    createTreeItemRenderContextDependencies(item, environment, treeId, isSearchMatching),
  );

  const treeInformation = useMemo(
    () => createTreeInformation(environment, treeId, search),
    createTreeInformationDependencies(environment, treeId, search),
  ); // TODO Construct in tree instead of every item

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

  return (renderers.renderItem(environment.items[props.itemIndex], props.depth, children, titleComponent, renderContext, treeInformation) ?? null) as any; // Type to use AllTreeRenderProps
}