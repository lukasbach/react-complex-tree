import React, { useRef } from 'react';
import { Meta } from '@storybook/react';
import { longTree } from 'demodata';
import { Tree } from '../tree/Tree';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { TreeEnvironmentRef, TreeRef } from '../types';

export default {
  title: 'Core/Delayed Data Source',
} as Meta;

export const TreeWithDelayedDataProvider = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={{
      getTreeItem: itemId =>
        new Promise(res => {
          setTimeout(() => res(longTree.items[itemId]), 750);
        }),
    }}
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {},
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const WithExpandOrCollapseAll = () => {
  const treeEnvironment = useRef<TreeEnvironmentRef>(null);
  const tree = useRef<TreeRef>(null);
  return (
    <UncontrolledTreeEnvironment<string>
      ref={treeEnvironment}
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={{
        getTreeItem: itemId =>
          new Promise(res => {
            setTimeout(() => res(longTree.items[itemId]), 750);
          }),
      }}
      getItemTitle={item => item.data}
      viewState={{
        'tree-1': {
          // expandedItems: ['Fruit', 'Meals', 'Asia', 'Desserts'],
        },
      }}
    >
      <button type="button" onClick={() => tree.current?.expandAll()}>
        Expand All
      </button>
      <button type="button" onClick={() => tree.current?.collapseAll()}>
        Collapse All
      </button>
      <Tree
        treeId="tree-1"
        rootItem="root"
        treeLabel="Tree Example"
        ref={tree}
      />
    </UncontrolledTreeEnvironment>
  );
};
