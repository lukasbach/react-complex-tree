import React from 'react';
import { Meta } from '@storybook/react';
import { ExplicitDataSource } from '../types';
import { Tree } from '../tree/Tree';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';

const itemsWithManyChildren: ExplicitDataSource = {
  items: {
    root: {
      index: 'root',
      children: ['innerRoot'],
      data: 'root',
      isFolder: true,
      canMove: true,
      canRename: true,
    },
    innerRoot: {
      index: 'innerRoot',
      children: [],
      data: 'innerRoot',
      isFolder: true,
      canMove: true,
      canRename: true,
    },
  },
};

for (let i = 0; i < 1000; i += 1) {
  const id = `item${i}`;
  itemsWithManyChildren.items[id] = {
    index: id,
    isFolder: false,
    data: id,
    canMove: true,
    canRename: true,
  };
  itemsWithManyChildren.items.innerRoot.children!.push(id);
}

export default {
  title: 'Core/Scalability',
} as Meta;

export const SingleTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={new StaticTreeDataProvider(itemsWithManyChildren.items)}
    getItemTitle={item => item.data}
    viewState={{}}
  >
    <Tree treeId="tree-1" rootItem="root" />
  </UncontrolledTreeEnvironment>
);
