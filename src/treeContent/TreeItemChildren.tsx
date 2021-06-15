import React, { useContext } from 'react';
import { TreeItem } from './TreeItem';
import { TreeItemIndex, TreeProps } from './types';
import { countVisibleChildrenIncludingSelf } from './helpers';
import { TreeEnvironmentContext } from './controlledEnvironment/ControlledTreeEnvironment';

export const TreeItemChildren = <T extends any>(props: {
  children: TreeItemIndex[];
  depth: number;
  parentId: TreeItemIndex;
}) => {
  const environment = useContext(TreeEnvironmentContext);

  let childElements: JSX.Element[] = [];

  for (const child of props.children) {
    childElements.push(
      <TreeItem
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