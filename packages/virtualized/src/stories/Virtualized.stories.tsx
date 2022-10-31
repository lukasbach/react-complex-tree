import { Meta } from '@storybook/react';
import React, { useRef } from 'react';
import { longTree, virtualizedTree } from 'demodata';
import {
  Tree,
  TreeRef,
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
} from 'react-complex-tree';
import { useVirtualTree } from '../index';

export default {
  title: 'Virtualized/Virtualized Demo',
} as Meta;

export const Virtualized = () => {
  const treeRef = useRef<TreeRef>(null);
  const { renderProps } = useVirtualTree({ treeRef, height: '600px' });

  return (
    <UncontrolledTreeEnvironment<string>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={
        new StaticTreeDataProvider(virtualizedTree.items, (item, data) => ({
          ...item,
          data,
        }))
      }
      getItemTitle={item => item.data}
      viewState={{
        'tree-1': {
          expandedItems: [],
        },
      }}
      {...renderProps}
    >
      <Tree
        treeId="tree-1"
        rootItem="root"
        treeLabel="Tree Example"
        ref={treeRef}
      />
    </UncontrolledTreeEnvironment>
  );
};
