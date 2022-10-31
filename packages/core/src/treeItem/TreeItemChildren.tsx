import React, { HTMLProps } from 'react';
import { TreeItemIndex } from '../types';
import { useTree } from '../tree/Tree';
import { LinearList } from '../tree/LinearList';

export const TreeItemChildren = (props: {
  children: TreeItemIndex[];
  depth: number;
  parentId: TreeItemIndex;
}): JSX.Element => {
  const { renderers, treeInformation } = useTree();

  const containerProps: HTMLProps<any> = {
    role: props.depth !== 0 ? 'group' : undefined,
  };

  return renderers.renderItemsContainer({
    children: <LinearList />,
    info: treeInformation,
    containerProps,
  }) as any;
};
