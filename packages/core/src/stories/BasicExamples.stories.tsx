import { Meta } from '@storybook/react';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';
import React from 'react';
import { longTree, shortTree } from 'demodata';

export default {
  title: 'Core/Basic Examples',
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

export const SingleTreeAllCollapsed = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop={true}
    canDropOnItemWithChildren={true}
    canReorderItems={true}
    dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({ ...item, data }))}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {},
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const SmallTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop={true}
    canDropOnItemWithChildren={true}
    canReorderItems={true}
    dataProvider={new StaticTreeDataProvider(shortTree.items, (item, data) => ({ ...item, data }))}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {},
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const MultipleTrees = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop={true}
    canDropOnItemWithChildren={true}
    canReorderItems={true}
    dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({ ...item, data }))}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {},
    }}
  >
    <div
      style={{
        display: 'flex',
        backgroundColor: '#D8DEE9',
        justifyContent: 'space-evenly',
        alignItems: 'baseline',
        padding: '20px 0',
      }}
    >
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree 1" />
      </div>
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-2" rootItem="root" treeLabel="Tree 2" />
      </div>
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-3" rootItem="root" treeLabel="Tree 3" />
      </div>
    </div>
  </UncontrolledTreeEnvironment>
);
