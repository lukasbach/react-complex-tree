import { Meta } from '@storybook/react';
import { Tree } from '../tree/Tree';
import React from 'react';
import { longTree } from 'demodata';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export default {
  title: 'Core/Hardcoded State',
} as Meta;

export const SimpleTree = () => (
  <ControlledTreeEnvironment<string>
    canDragAndDrop={true}
    canDropOnItemWithChildren={true}
    canReorderItems={true}
    items={longTree.items}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts'],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </ControlledTreeEnvironment>
);
