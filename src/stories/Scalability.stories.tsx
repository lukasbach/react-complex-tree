import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { ExplicitDataSource, TreeInformation, TreeItem, TreeItemRenderContext, TreeRenderProps } from '../types';
import { Tree } from '../treeContent/Tree';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';

const demoRenderers: TreeRenderProps<string> = {
  renderItemTitle(item: TreeItem<string>, context: TreeItemRenderContext, info: TreeInformation): string {
    return item.data;
  },
};

const itemsWithManyChildren: ExplicitDataSource = {
  items: {
    root: {
      index: 'root',
      children: ['innerRoot'],
      data: 'root',
      hasChildren: true,
      canMove: true,
      canRename: true,
    },
    innerRoot: {
      index: 'innerRoot',
      children: [],
      data: 'innerRoot',
      hasChildren: true,
      canMove: true,
      canRename: true,
    },
  }
};

for (let i = 0; i < 1000; i++) {
  const id = `item${i}`;
  itemsWithManyChildren.items[id] = {
    index: id,
    hasChildren: false,
    data: id,
    canMove: true,
    canRename: true,
  };
  itemsWithManyChildren.items['innerRoot'].children!.push(id);
}

export default {
  title: 'Scalability',
} as Meta;

export const SingleTree = () => (
  <UncontrolledTreeEnvironment
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    dataProvider={new StaticTreeDataProvider(itemsWithManyChildren.items)}
    viewState={{
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" />
  </UncontrolledTreeEnvironment>
);