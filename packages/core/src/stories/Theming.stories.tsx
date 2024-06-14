import { Meta } from '@storybook/react';
import { longTree } from 'demodata';
import React from 'react';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';

export default {
  title: 'Core/Custom Renderers',
} as Meta;

export const MinimalRenderers = () => (
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
    renderItemTitle={({ title }) => <span>{title}</span>}
    renderItemArrow={({ item, context }) =>
      item.isFolder ? (
        context.isExpanded ? (
          <span>{'>'}</span>
        ) : (
          <span>v</span>
        )
      ) : null
    }
    renderItem={({ title, arrow, context, children }) => {
      const InteractiveComponent = context.isRenaming ? 'div' : 'button';
      return (
        <li {...context.itemContainerWithChildrenProps}>
          <InteractiveComponent
            type="button"
            {...context.itemContainerWithoutChildrenProps}
            {...(context.interactiveElementProps as any)}
          >
            {arrow}
            {title}
          </InteractiveComponent>
          {children}
        </li>
      );
    }}
    renderTreeContainer={({ children, containerProps }) => (
      <div {...containerProps}>{children}</div>
    )}
    renderItemsContainer={({ children, containerProps }) => (
      <ul {...containerProps}>{children}</ul>
    )}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);
