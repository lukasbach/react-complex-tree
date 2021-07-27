import { Meta } from '@storybook/react';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';
import React from 'react';
import { longTree, shortTree } from 'demodata';

export default {
  title: 'Core/Accessibility',
} as Meta;

export const SingleTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop={true}
    canDropOnItemWithChildren={true}
    canReorderItems={true}
    dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({ ...item, data }))}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts'],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);
