import React, { useContext } from 'react';
import { TreeItem } from './TreeItem';
import { TreeItemIndex, TreeItemPath, TreeProps } from './types';
import { countVisibleChildrenIncludingSelf } from './helpers';
import { TreeEnvironmentContext } from './ControlledTreeEnvironment';

export const TreeItemChildren = <T extends any>(props: {
  children: TreeItemIndex[];
  indexOffset: number;
  depth: number;
  parentPath: TreeItemPath;
}) => {
  const environment = useContext(TreeEnvironmentContext);

  let childElements: JSX.Element[] = [];
  let cumulativeIndexOffset = props.indexOffset;

  for (const child of props.children) {
    childElements.push(
      <TreeItem
        itemId={child}
        path={[...props.parentPath, child]}
        depth={props.depth}
        indexOffset={cumulativeIndexOffset}
      />
    );

    cumulativeIndexOffset += countVisibleChildrenIncludingSelf(environment, [...props.parentPath, child]);
  }

  return (
    <>
      {childElements}
    </>
  );
}