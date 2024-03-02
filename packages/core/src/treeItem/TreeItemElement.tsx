import React, { useMemo, useState } from 'react';
import { TreeItemIndex } from '../types';
import { TreeItemChildren } from './TreeItemChildren';
import { useViewState } from '../tree/useViewState';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useTreeItemRenderContext } from './useTreeItemRenderContext';
import { TreeItemRenamingInput } from './TreeItemRenamingInput';

export const TreeItemElement = (props: {
  itemIndex: TreeItemIndex;
  depth: number;
}): JSX.Element => {
  const [hasBeenRequested, setHasBeenRequested] = useState(false);
  const { renderers, treeInformation, renamingItem } = useTree();
  const environment = useTreeEnvironment();
  const viewState = useViewState();
  const item = environment.items[props.itemIndex];

  const isExpanded = useMemo(
    () => viewState.expandedItems?.includes(props.itemIndex),
    [props.itemIndex, viewState.expandedItems]
  );

  const renderContext = useTreeItemRenderContext(item)!;

  if (item === undefined || renderContext === undefined) {
    if (!hasBeenRequested) {
      setHasBeenRequested(true);
      environment.onMissingItems?.([props.itemIndex]);
    }
    return null as any;
  }

  const shouldRenderChildren =
    environment.shouldRenderChildren?.(item, renderContext) ??
    (item.isFolder && isExpanded);

  const children = item.children && shouldRenderChildren && (
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
