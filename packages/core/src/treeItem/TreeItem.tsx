import { TreeItemIndex } from '../types';
import React, { useMemo, useState } from 'react';
import { TreeItemChildren } from './TreeItemChildren';
import { useViewState } from '../tree/useViewState';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useTreeItemRenderContext } from './useTreeItemRenderContext';
import { TreeItemRenamingInput } from './TreeItemRenamingInput';

export const TreeItem = (props: { itemIndex: TreeItemIndex; depth: number }): JSX.Element => {
  const [hasBeenRequested, setHasBeenRequested] = useState(false);
  const { renderers, treeInformation, renamingItem } = useTree();
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
    <TreeItemChildren depth={props.depth + 1} parentId={props.itemIndex}>
      {item.children}
    </TreeItemChildren>
  );

  const title = environment.getItemTitle(item);
  const titleComponent =
    renamingItem === props.itemIndex ? (
      <TreeItemRenamingInput itemIndex={props.itemIndex} />
    ) : (
      renderers.renderItemTitle({
        info: treeInformation,
        context: renderContext,
        title,
        item,
      })
    );

  const arrowComponent = renderers.renderItemArrow({
    info: treeInformation,
    context: renderContext,
    item: environment.items[props.itemIndex],
  });

  return (renderers.renderItem({
    item: environment.items[props.itemIndex],
    depth: props.depth,
    title: titleComponent,
    arrow: arrowComponent,
    context: renderContext,
    info: treeInformation,
    children,
  }) ?? null) as any; // Type to use AllTreeRenderProps
};
