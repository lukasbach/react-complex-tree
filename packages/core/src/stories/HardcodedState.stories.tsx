import { Meta } from '@storybook/react';
import React from 'react';
import { longTree } from 'demodata';
import { Tree } from '../tree/Tree';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export default {
  title: 'Core/Hardcoded State',
} as Meta;

export const SimpleTree = () => (
  <ControlledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    items={longTree.items}
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {
        expandedItems: [
          'Fruit',
          'Meals',
          'America',
          'Europe',
          'Asia',
          'Desserts',
        ],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </ControlledTreeEnvironment>
);
