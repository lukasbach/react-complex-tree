import React from 'react';
import { AllTreeRenderProps, TreeRenderProps } from '../types';

const cx = (...classNames: Array<string | undefined | false>) => classNames.filter(cn => !!cn).join(' ');

export const createDefaultRenderers = (renderers: TreeRenderProps): AllTreeRenderProps => {
  return {
    renderItemTitle: renderers.renderItemTitle,
    renderItem: (item, depth, context, info) => {
      return (
        <li
          role="none"
          style={{ paddingLeft: `${depth * (renderers.renderDepthOffset ?? 10)}px` }}
          className={cx(
            'rbt-tree-item-li',
            context.isSelected && 'rbt-tree-item-li-selected',
            context.isExpanded && 'rbt-tree-item-li-expanded',
          )}
        >
          <button
            role="treeitem"
            {...context.itemContainerProps as any}
            className={cx(
              'rbt-tree-item-button',
              context.isSelected && 'rbt-tree-item-li-button',
              context.isExpanded && 'rbt-tree-item-li-button',
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
    renderTreeContainer: (children, containerProps) => {
      return <div {...containerProps}>{ children }</div>
    },
    renderDepthOffset: 4,
  };
};