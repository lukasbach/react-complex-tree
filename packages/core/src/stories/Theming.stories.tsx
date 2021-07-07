import { Meta } from '@storybook/react';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { longTree } from 'demodata';
import { Tree } from '../tree/Tree';
import React from 'react';

export default {
  title: 'Core/Custom Renderers',
} as Meta;

export const MinimalRenderers = () => (
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
    renderItemTitle={({ title }) => <span>{title}</span>}
    renderItemArrow={({ item, context }) =>
      item.hasChildren ? context.isExpanded ? <span>{'>'}</span> : <span>{'v'}</span> : null
    }
    renderItem={({ title, arrow, context, children }) => (
      <li {...context.itemContainerWithChildrenProps}>
        <button {...context.itemContainerWithoutChildrenProps} {...(context.interactiveElementProps as any)}>
          {arrow}
          {title}
        </button>
        {children}
      </li>
    )}
    renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
    renderItemsContainer={({ children, containerProps }) => <ul {...containerProps}>{children}</ul>}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);
