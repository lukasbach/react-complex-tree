import { Meta } from '@storybook/react';
import React from 'react';
import { longTree } from 'demodata';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(cn => !!cn).join(' ');

export default {
  title: 'Core/Custom View State',
} as Meta;

export const SingleTree = () => (
  <UncontrolledTreeEnvironment<string, 'activeItems'>
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
    renderItem={({ item, depth, children, title, context, arrow }) => {
      const InteractiveComponent = context.isRenaming ? 'div' : 'button';
      const type = context.isRenaming ? undefined : 'button';
      return (
        <li
          {...(context.itemContainerWithChildrenProps as any)}
          className={cx(
            'rct-tree-item-li',
            item.isFolder && 'rct-tree-item-li-isFolder',
            context.isSelected && 'rct-tree-item-li-selected',
            context.isExpanded && 'rct-tree-item-li-expanded',
            context.isFocused && 'rct-tree-item-li-focused',
            context.isDraggingOver && 'rct-tree-item-li-dragging-over',
            context.isSearchMatching && 'rct-tree-item-li-search-match'
          )}
        >
          <div
            {...(context.itemContainerWithoutChildrenProps as any)}
            style={{ paddingLeft: `${(depth + 1) * 10}px` }}
            className={cx(
              'rct-tree-item-title-container',
              item.isFolder && 'rct-tree-item-title-container-isFolder',
              context.isSelected && 'rct-tree-item-title-container-selected',
              context.isExpanded && 'rct-tree-item-title-container-expanded',
              context.isFocused && 'rct-tree-item-title-container-focused',
              context.isDraggingOver &&
                'rct-tree-item-title-container-dragging-over',
              context.isSearchMatching &&
                'rct-tree-item-title-container-search-match'
            )}
          >
            {arrow}
            <InteractiveComponent
              type={type}
              {...(context.interactiveElementProps as any)}
              className={cx('rct-tree-item-button')}
            >
              {title}
              {context.viewStateFlags.activeItems ? ' (marked as active)' : ''}
            </InteractiveComponent>
          </div>
          {children}
        </li>
      );
    }}
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
        activeItems: ['America', 'Europe'],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);
