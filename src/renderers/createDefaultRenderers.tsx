import React from 'react';
import { AllTreeRenderProps, TreeRenderProps } from '../types';

const cx = (...classNames: Array<string | undefined | false>) => classNames.filter(cn => !!cn).join(' ');

export const createDefaultRenderers = (renderers: TreeRenderProps): AllTreeRenderProps => {
  return {
    renderItemTitle: renderers.renderItemTitle,
    renderItem: (item, depth, children, context, info) => {
      return (
        <li
          role="none"
          className={cx(
            'rbt-tree-item-li',
            item.hasChildren && 'rbt-tree-item-li-hasChildren',
            context.isSelected && 'rbt-tree-item-li-selected',
            context.isExpanded && 'rbt-tree-item-li-expanded',
            context.isFocused && 'rbt-tree-item-li-focused',
            context.isDraggingOver && 'rbt-tree-item-li-dragging-over',
          )}
        >
          <button
            {...context.itemContainerElementProps as any}
            {...context.interactiveElementProps as any}
            role="treeitem"
            tabIndex={context.isFocused ? 0 : -1} // TODO 0 if focused
            style={{ paddingLeft: `${(depth + 1) * (renderers.renderDepthOffset ?? 10)}px` }}
            className={cx(
              'rbt-tree-item-button',
              item.hasChildren && 'rbt-tree-item-button-hasChildren',
              context.isSelected && 'rbt-tree-item-button-selected',
              context.isExpanded && 'rbt-tree-item-button-expanded',
              context.isFocused && 'rbt-tree-item-button-focused',
              context.isDraggingOver && 'rbt-tree-item-button-dragging-over',
            )}
          >
            { renderers.renderItemTitle(item, context, info) }
          </button>
          {children}
        </li>
      );
    },
    renderRenameInput: (item, inputProps, submitButtonProps) => {
      return <div />;
    },
    renderDraggingItem: items => {
      return <div />;
    },
    renderDraggingItemTitle: items => {
      return <div />;
    },
    renderTreeContainer: (children, containerProps, info) => {
      return (
        <div
          {...containerProps}
          className={cx(
            'rbt-tree-root',
            info.isFocused && 'rbt-tree-root-focus',
            info.isRenaming && 'rbt-tree-root-renaming',
            info.areItemsSelected && 'rbt-tree-root-itemsselected',
          )}
        >
          { children }
        </div>
      );
    },
    renderDragBetweenLine: (draggingPosition, lineProps) => {
      return (
        <div
          {...lineProps}
          style={{ left: `${draggingPosition.depth * (renderers.renderDepthOffset ?? 10)}px` }}
          className={cx(
            'rbt-tree-drag-between-line',
            draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'top' && 'rbt-tree-drag-between-line-top',
            draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'bottom' && 'rbt-tree-drag-between-line-bottom',
          )}
        />
      );
    },
    renderSearchInput: (inputProps) => {
      return (
        <input
          {...inputProps}
          className={cx(
            'rbt-tree-search-input',
          )}
        />
      )
    },
    renderDepthOffset: 4,
  };
};