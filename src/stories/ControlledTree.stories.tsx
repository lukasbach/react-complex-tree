import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { ExplicitDataSource, TreeInformation, TreeItem, TreeItemRenderContext, TreeRenderProps } from '../types';
import { Tree } from '../treeContent/Tree';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';

const demoRenderers: TreeRenderProps<string> = {
  // renderItem(item: TreeItem<string>, depth: number, context: TreeItemRenderContext, info: TreeInformation): React.ReactNode {
  //   return (
  //     <div {...context.itemContainerProps as any} style={{ marginLeft: `${depth * 5}px` }}>
  //       {item.data}
  //     </div>
  //   );
  // },
  renderItemTitle(item: TreeItem<string>, context: TreeItemRenderContext, info: TreeInformation): string {
    return item.data;
  },
};

const demoContent: { data: ExplicitDataSource } = {
  data: {
    items: {
      root: {
        index: 'root',
        hasChildren: true,
        children: ['child1', 'child2'],
        data: 'root',
        canMove: true,
      },
      child1: {
        index: 'child1',
        hasChildren: true,
        children: ['child11'],
        data: 'child1',
        canMove: true,
      },
      child2: {
        index: 'child2',
        hasChildren: true,
        children: ['child21'],
        data: 'child2',
        canMove: true,
      },
      child21: {
        index: 'child21',
        hasChildren: false,
        data: 'child21',
        canMove: true,
      },
      child11: {
        index: 'child11',
        hasChildren: true,
        children: ['child111', 'child112'],
        data: 'child11',
        canMove: true,
      },
      child111: {
        index: 'child111',
        hasChildren: false,
        data: 'child111',
        canMove: true,
      },
      child112: {
        index: 'child112',
        hasChildren: true,
        children: ['child1121'],
        data: 'child112',
        canMove: true,
      },
      child1121: {
        index: 'child1121',
        hasChildren: false,
        data: 'child1121',
        canMove: true,
      },
    }
  }
};


export default {
  title: 'Tree',
  component: ControlledTreeEnvironment,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

export const Example = () => (
  <UncontrolledTreeEnvironment
    dataProvider={new StaticTreeDataProvider(demoContent.data.items)}
    viewState={{
      ['tree-1']: {
        expandedItems: ['child1', 'child11', 'child2']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" />
  </UncontrolledTreeEnvironment>
);