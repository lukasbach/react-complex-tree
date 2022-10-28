import { Meta } from '@storybook/react';
import React from 'react';
import { longTree } from 'demodata';
import { Tree } from '../tree/Tree';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export default {
  title: 'Core/Controlled Environment',
} as Meta;

export const StaticState = () => (
  <ControlledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    items={longTree.items}
    getItemTitle={item => item.data}
    viewState={{}}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </ControlledTreeEnvironment>
);
