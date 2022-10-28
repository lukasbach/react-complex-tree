import { Meta } from '@storybook/react';
import React from 'react';
import { longTree } from 'demodata';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';

export default {
  title: 'Core/Drag-and-Drop Configurability',
} as Meta;

export const NoDragAndDrop = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
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
  </UncontrolledTreeEnvironment>
);

export const NoDropOnItemsAllowed = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    canDragAndDrop
    canReorderItems
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
  </UncontrolledTreeEnvironment>
);

export const OnlyDropOnItemsWithChildren = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    canDragAndDrop
    canDropOnFolder
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
  </UncontrolledTreeEnvironment>
);

export const OnlyDropOnItemsWithoutChildren = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    canDragAndDrop
    canDropOnItemWithoutChildren
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
  </UncontrolledTreeEnvironment>
);

export const NoReorderingAllowed = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    canDragAndDrop
    canDropOnFolder
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
  </UncontrolledTreeEnvironment>
);

export const AllowDraggingOnlyItemsStartingWithA = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    canDrag={items =>
      items
        .map(item => (item.data as string).startsWith('A'))
        .reduce((a, b) => a && b, true)
    }
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
  </UncontrolledTreeEnvironment>
);

export const AllowDroppingOnlyOnItemsStartingWithA = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    canDropAt={(items, target) =>
      target.targetType === 'between-items'
        ? (target.parentItem as string).startsWith('A')
        : (target.targetItem as string).startsWith('A')
    }
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
  </UncontrolledTreeEnvironment>
);
