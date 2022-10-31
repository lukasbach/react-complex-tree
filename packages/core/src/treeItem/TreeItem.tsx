import React, { CSSProperties, useState } from 'react';
import { TreeItemIndex } from '../types';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useTreeItemRenderContext } from './useTreeItemRenderContext';
import { TreeItemRenamingInput } from './TreeItemRenamingInput';

export const TreeItem = (props: {
  itemIndex: TreeItemIndex;
  depth: number;
  style: CSSProperties;
}): JSX.Element => {
  const [hasBeenRequested, setHasBeenRequested] = useState(false);
  const { renderers, treeInformation, renamingItem } = useTree();
  const environment = useTreeEnvironment();
  const item = environment.items[props.itemIndex];

  const renderContext = useTreeItemRenderContext(item)!;

  if (item === undefined || renderContext === undefined) {
    if (!hasBeenRequested) {
      setHasBeenRequested(true);
      environment.onMissingItems?.([props.itemIndex]);
    }
    return null as any;
  }

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
    style: props.style,
    key: `${props.itemIndex}`,
  }) ?? null) as any; // Type to use AllTreeRenderProps
};
