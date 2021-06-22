import React from 'react';
import { AllTreeRenderProps, TreeRenderProps } from '../types';

const cx = (...classNames: Array<string | undefined | false>) => classNames.filter(cn => !!cn).join(' ');

export const createDefaultRenderers = (renderers: TreeRenderProps): AllTreeRenderProps => {
  return {
    renderItemTitle: (title, item, context, info) => {
      if (!info.isSearching || !context.isSearchMatching) {
        return (<>{title}</>);
      } else {
        const startIndex = title.toLowerCase().indexOf(info.search!.toLowerCase());
        return (
          <React.Fragment>
            { startIndex > 0 && (<span>{title.slice(0, startIndex)}</span>) }
            <span className="rct-tree-item-search-highlight">{title.slice(startIndex, startIndex + info.search!.length)}</span>
            { startIndex + info.search!.length < title.length && (<span>{title.slice(startIndex + info.search!.length, title.length)}</span>)}
          </React.Fragment>
        );
      }
    },
    renderItem: (item, depth, children, title, context, info) => {
      const InnerComponent = context.isRenaming ? 'div' : 'button';
      return (
        <li
          {...context.itemContainerWithChildrenProps as any}
          role="none"
          className={cx(
            'rct-tree-item-li',
            item.hasChildren && 'rct-tree-item-li-hasChildren',
            context.isSelected && 'rct-tree-item-li-selected',
            context.isExpanded && 'rct-tree-item-li-expanded',
            context.isFocused && 'rct-tree-item-li-focused',
            context.isDraggingOver && 'rct-tree-item-li-dragging-over',
            context.isSearchMatching && 'rct-tree-item-li-search-match',
          )}
        >
          <InnerComponent
            {...context.itemContainerWithoutChildrenProps as any}
            {...context.interactiveElementProps as any}
            style={{ paddingLeft: `${(depth + 1) * (renderers.renderDepthOffset ?? 10)}px` }}
            className={cx(
              'rct-tree-item-button',
              item.hasChildren && 'rct-tree-item-button-hasChildren',
              context.isSelected && 'rct-tree-item-button-selected',
              context.isExpanded && 'rct-tree-item-button-expanded',
              context.isFocused && 'rct-tree-item-button-focused',
              context.isDraggingOver && 'rct-tree-item-button-dragging-over',
              context.isSearchMatching && 'rct-tree-item-button-search-match',
            )}
          >
            { title }
          </InnerComponent>
          {children}
        </li>
      );
    },
    renderRenameInput: (item, inputProps, inputRef, submitButtonProps, formProps) => {
      return (
        <form
          {...formProps}
          className="rct-tree-item-renaming-form"
        >
          <input
            {...inputProps}
            ref={inputRef}
            className="rct-tree-item-renaming-input"
          />
          <input
            {...submitButtonProps}
            type="submit"
            className="rct-tree-item-renaming-submit-button"
            value="🗸"
          />
        </form>
      );
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
          className={cx(
            'rct-tree-root',
            info.isFocused && 'rct-tree-root-focus',
            info.isRenaming && 'rct-tree-root-renaming',
            info.areItemsSelected && 'rct-tree-root-itemsselected',
          )}
        >
          <div {...containerProps}>
            { children }
          </div>
        </div>
      );
    },
    renderItemsContainer: (children, containerProps, info) => {
      return (
        <ul
          {...containerProps}
          className="rct-tree-items-container"
        >
          { children }
        </ul>
      )
    },
    renderDragBetweenLine: (draggingPosition, lineProps) => {
      return (
        <div
          {...lineProps}
          style={{ left: `${draggingPosition.depth * (renderers.renderDepthOffset ?? 10)}px` }}
          className={cx(
            'rct-tree-drag-between-line',
            draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'top' && 'rct-tree-drag-between-line-top',
            draggingPosition.targetType === 'between-items' && draggingPosition.linePosition === 'bottom' && 'rct-tree-drag-between-line-bottom',
          )}
        />
      );
    },
    renderSearchInput: (inputProps) => {
      return (
        <div className={cx('rct-tree-search-input-container')}>
          <input
            {...inputProps}
            className={cx(
              'rct-tree-search-input',
            )}
          />
        </div>
      )
    },
    renderDepthOffset: 4,
  };
};