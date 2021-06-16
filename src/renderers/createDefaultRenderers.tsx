import React from 'react';
import { AllTreeRenderProps, TreeRenderProps } from '../types';

const cx = (...classNames: Array<string | undefined | false>) => classNames.filter(cn => !!cn).join(' ');

export const createDefaultRenderers = (renderers: TreeRenderProps): AllTreeRenderProps => {
  return {
    renderItemTitle: renderers.renderItemTitle,
    renderItem: (item, depth, context, info) => {
      return (
        <li
          {...context.containerElementProps as any}
          role="none"
          style={{ paddingLeft: `${depth * (renderers.renderDepthOffset ?? 10)}px` }}
          className={cx(
            'rbt-tree-item-li',
            item.hasChildren && 'rbt-tree-item-li-hasChildren',
            context.isSelected && 'rbt-tree-item-li-selected',
            context.isExpanded && 'rbt-tree-item-li-expanded',
            context.isDraggingOver && 'rbt-tree-item-li-dragging-over',
          )}
        >
          <button
            role="treeitem"
            tabIndex={-1} // TODO 0 if focused
            {...context.interactiveElementProps as any}
            className={cx(
              'rbt-tree-item-button',
              item.hasChildren && 'rbt-tree-item-button-hasChildren',
              context.isSelected && 'rbt-tree-item-button-selected',
              context.isExpanded && 'rbt-tree-item-button-expanded',
              context.isDraggingOver && 'rbt-tree-item-button-dragging-over',
            )}
          >
            { renderers.renderItemTitle(item, context, info) }
          </button>
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
    renderDragBetweenLine: (draggingPosition) => {
      return (
        <div
          style={{ left: `${draggingPosition.depth * (renderers.renderDepthOffset ?? 10)}px` }}
          className={cx(
            'rbt-tree-drag-between-line',
            draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'top' && 'rbt-tree-drag-between-line-top',
            draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'bottom' && 'rbt-tree-drag-between-line-bottom',
          )}
        />
      );
    },
    renderDepthOffset: 4,
  };
};