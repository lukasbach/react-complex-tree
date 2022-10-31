import React, { FC } from 'react';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItem } from '../treeItem/TreeItem';

export const LinearList: FC = () => {
  const { treeId } = useTree();
  const { linearItems: envLinearItems, renderLinearList } =
    useTreeEnvironment();
  const linearItems = envLinearItems[treeId];

  if (!linearItems) {
    return null;
  }

  return (
    <>
      {renderLinearList({
        items: linearItems,
        renderItem: props => <TreeItem {...props} />,
      })}
    </>
  );
};
