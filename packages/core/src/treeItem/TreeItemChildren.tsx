import React, { useContext } from 'react';
import { TreeItem } from './TreeItem';
import { TreeItemIndex, TreeProps } from '../types';

export const TreeItemChildren = <T extends any>(props: {
  children: TreeItemIndex[];
  depth: number;
  parentId: TreeItemIndex;
}) => {
  let childElements: JSX.Element[] = [];

  for (const child of props.children) {
    childElements.push(
      <TreeItem
        key={child}
        itemIndex={child}
        depth={props.depth}
      />
    );
  }

  return (
    <div>
      {childElements}
    </div>
  );
}