import React, { HTMLProps } from 'react';
import { TreeItemElement } from './TreeItemElement';
import { TreeItemIndex } from '../types';
import { useTree } from '../tree/Tree';

export const TreeItemChildren = (props: {
  children: TreeItemIndex[];
  depth: number;
  parentId: TreeItemIndex;
}): JSX.Element => {
  const { renderers, treeInformation } = useTree();

  const childElements: JSX.Element[] = [];

  for (const child of props.children) {
    childElements.push(
      <TreeItemElement key={child} itemIndex={child} depth={props.depth} />
    );
  }

  if (childElements.length === 0) {
    return null as any;
  }

  const containerProps: HTMLProps<any> = {
    role: props.depth !== 0 ? 'group' : undefined,
  };

  return renderers.renderItemsContainer({
    children: childElements,
    info: treeInformation,
    containerProps,
    depth: props.depth,
    parentId: props.parentId,
  }) as any;
};
