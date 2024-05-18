import { Meta } from '@storybook/react';
import React from 'react';
import { longTree } from 'demodata';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';
import { defaultLiveDescriptors } from '../tree/defaultLiveDescriptors';

export default {
  title: 'Core/Accessibility',
} as Meta;

const VisibleLiveDescriptorContainer = ({ children, tree }: any) => (
  <div
    id={`rct-livedescription-${tree.treeId}`}
    style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '250px',
      fontSize: '10px',
      backgroundColor: 'rgba(255, 255, 255, .5)',
    }}
  >
    {children}
  </div>
);

export const VisibleLiveDescriptors = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
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
    renderLiveDescriptorContainer={VisibleLiveDescriptorContainer}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const CustomHotkeys = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {
        expandedItems: ['Fruit', 'Meals', 'Desserts'],
      },
    }}
    keyboardBindings={{
      primaryAction: ['f3'],
      renameItem: ['control+e'],
      abortRenameItem: ['control'],
      startProgrammaticDnd: ['f2'],
      completeProgrammaticDnd: ['control'],
      abortProgrammaticDnd: ['enter'],
    }}
    renderLiveDescriptorContainer={VisibleLiveDescriptorContainer}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const CustomDescriptors = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {
        expandedItems: ['Fruit', 'Meals', 'Desserts'],
      },
    }}
    liveDescriptors={{
      ...defaultLiveDescriptors,
      introduction: '<em>Custom live descriptor for tree {treeLabel}</em>',
      renamingItem: '<em>Renaming {renamingItem}',
      programmaticallyDragging: '<em>Dragging {dragItems}</em>',
      programmaticallyDraggingTarget: '<em>Target is {dropTarget}</em>',
    }}
    renderLiveDescriptorContainer={VisibleLiveDescriptorContainer}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const NoDescriptors = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {
        expandedItems: ['Fruit', 'Meals', 'Desserts'],
      },
    }}
    showLiveDescription={false}
  >
    <p>
      The following tree has no accessibility descriptors in the DOM at all.
    </p>
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const NoKeyboardBindings = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {},
    }}
    keyboardBindings={{
      primaryAction: [],
      moveFocusToFirstItem: [],
      moveFocusToLastItem: [],
      expandSiblings: [],
      renameItem: [],
      abortRenameItem: [],
      toggleSelectItem: [],
      abortSearch: [],
      startSearch: [],
      selectAll: [],
      startProgrammaticDnd: [],
      abortProgrammaticDnd: [],
      completeProgrammaticDnd: [],
    }}
    disableArrowKeys
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);
