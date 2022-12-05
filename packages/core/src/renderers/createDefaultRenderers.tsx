import React from 'react';
import { AllTreeRenderProps } from '../types';

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(cn => !!cn).join(' ');

export const createDefaultRenderers = (
  renderDepthOffset: number
): AllTreeRenderProps => ({
  renderItemTitle: ({ title, context, info }) => {
    if (!info.isSearching || !context.isSearchMatching) {
      return title;
    }
    const startIndex = title.toLowerCase().indexOf(info.search!.toLowerCase());
    return (
      <>
        {startIndex > 0 && <span>{title.slice(0, startIndex)}</span>}
        <span className="rct-tree-item-search-highlight">
          {title.slice(startIndex, startIndex + info.search!.length)}
        </span>
        {startIndex + info.search!.length < title.length && (
          <span>
            {title.slice(startIndex + info.search!.length, title.length)}
          </span>
        )}
      </>
    );
  },
  renderItemArrow: ({ item, context }) => (
    // Icons from https://blueprintjs.com/docs/#icons
    <div
      className={cx(
        item.isFolder && 'rct-tree-item-arrow-isFolder',
        'rct-tree-item-arrow'
      )}
      {...context.arrowProps}
    >
      {item.isFolder &&
        (context.isExpanded ? (
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 16 16"
            enableBackground="new 0 0 16 16"
            xmlSpace="preserve"
          >
            <g>
              <g>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12,5c-0.28,0-0.53,0.11-0.71,0.29L8,8.59L4.71,5.29C4.53,5.11,4.28,5,4,5
                      C3.45,5,3,5.45,3,6c0,0.28,0.11,0.53,0.29,0.71l4,4C7.47,10.89,7.72,11,8,11s0.53-0.11,0.71-0.29l4-4C12.89,6.53,13,6.28,13,6
                      C13,5.45,12.55,5,12,5z"
                  className="rct-tree-item-arrow-path"
                />
              </g>
            </g>
          </svg>
        ) : (
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 16 16"
            enableBackground="new 0 0 16 16"
            xmlSpace="preserve"
          >
            <g>
              <g>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.71,7.29l-4-4C6.53,3.11,6.28,3,6,3C5.45,3,5,3.45,5,4
                      c0,0.28,0.11,0.53,0.29,0.71L8.59,8l-3.29,3.29C5.11,11.47,5,11.72,5,12c0,0.55,0.45,1,1,1c0.28,0,0.53-0.11,0.71-0.29l4-4
                      C10.89,8.53,11,8.28,11,8C11,7.72,10.89,7.47,10.71,7.29z"
                  className="rct-tree-item-arrow-path"
                />
              </g>
            </g>
          </svg>
        ))}
    </div>
  ),
  renderItem: ({ item, depth, children, title, context, arrow }) => {
    const InteractiveComponent = context.isRenaming ? 'div' : 'button';
    const type = context.isRenaming ? undefined : 'button';
    // TODO have only root li component create all the classes
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
          style={{ paddingLeft: `${(depth + 1) * renderDepthOffset}px` }}
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
            className={cx(
              'rct-tree-item-button',
              item.isFolder && 'rct-tree-item-button-isFolder',
              context.isSelected && 'rct-tree-item-button-selected',
              context.isExpanded && 'rct-tree-item-button-expanded',
              context.isFocused && 'rct-tree-item-button-focused',
              context.isDraggingOver && 'rct-tree-item-button-dragging-over',
              context.isSearchMatching && 'rct-tree-item-button-search-match'
            )}
          >
            {title}
          </InteractiveComponent>
        </div>
        {children}
      </li>
    );
  },
  renderRenameInput: ({
    inputProps,
    inputRef,
    submitButtonProps,
    submitButtonRef,
    formProps,
  }) => (
    <form {...formProps} className="rct-tree-item-renaming-form">
      <input
        {...inputProps}
        ref={inputRef}
        className="rct-tree-item-renaming-input"
      />
      <input
        {...submitButtonProps}
        ref={submitButtonRef}
        type="submit"
        className="rct-tree-item-renaming-submit-button"
        value="🗸"
      />
    </form>
  ),
  renderDraggingItem: () => <div />,
  renderDraggingItemTitle: () => <div />,
  renderTreeContainer: ({ children, containerProps, info }) => (
    <div
      className={cx(
        'rct-tree-root',
        info.isFocused && 'rct-tree-root-focus',
        info.isRenaming && 'rct-tree-root-renaming',
        info.areItemsSelected && 'rct-tree-root-itemsselected'
      )}
    >
      <div
        {...containerProps}
        style={{ minHeight: '30px', ...containerProps.style }}
      >
        {children}
      </div>
    </div>
  ),
  renderItemsContainer: ({ children, containerProps }) => (
    <ul {...containerProps} className="rct-tree-items-container">
      {children}
    </ul>
  ),
  renderDragBetweenLine: ({ draggingPosition, lineProps }) => (
    <div
      {...lineProps}
      style={{ left: `${draggingPosition.depth * renderDepthOffset}px` }}
      className={cx(
        'rct-tree-drag-between-line',
        draggingPosition.targetType === 'between-items' &&
          draggingPosition.linePosition === 'top' &&
          'rct-tree-drag-between-line-top',
        draggingPosition.targetType === 'between-items' &&
          draggingPosition.linePosition === 'bottom' &&
          'rct-tree-drag-between-line-bottom'
      )}
    />
  ),
  renderSearchInput: ({ inputProps }) => (
    <div className={cx('rct-tree-search-input-container')}>
      <input {...inputProps} className={cx('rct-tree-search-input')} />
    </div>
  ),
  renderLiveDescriptorContainer: ({ tree, children }) => (
    <div
      id={`rct-livedescription-${tree.treeId}`}
      style={{
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      }}
    >
      {children}
    </div>
  ),
  renderDepthOffset: 10,
});
