import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { Tree } from '../tree/Tree';
import React from 'react';
import { Meta } from '@storybook/react';
import { longTree } from 'demodata';

export default {
  title: 'Core/Delayed Data Source',
} as Meta;

export const TreeWithDelayedDataProvider = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop={true}
    canDropOnItemWithChildren={true}
    canReorderItems={true}
    dataProvider={{
      getTreeItem: itemId => {
        return new Promise(res => setTimeout(() => res(longTree.items[itemId]), 750));
      },
    }}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {},
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);
