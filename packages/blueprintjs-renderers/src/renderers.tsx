import React from 'react';
import { TreeRenderProps } from 'react-complex-tree';
import {
  Button,
  Classes,
  Collapse,
  Colors,
  Icon,
  InputGroup,
} from '@blueprintjs/core';

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(cn => !!cn).join(' ');

export const renderers: TreeRenderProps = {
  renderTreeContainer: props => (
    <div className={cx(Classes.TREE)}>
      <ul
        className={cx(Classes.TREE_ROOT, Classes.TREE_NODE_LIST)}
        {...props.containerProps}
      >
        {props.children}
      </ul>
    </div>
  ),

  renderItemsContainer: props => (
    <ul className={cx(Classes.TREE_NODE_LIST)} {...props.containerProps}>
      {props.children}
    </ul>
  ),

  renderItem: props => (
    <li
      className={cx(
        Classes.TREE_NODE,
        (props.context.isSelected || props.context.isDraggingOver) &&
          Classes.TREE_NODE_SELECTED
      )}
      {...(props.context.itemContainerWithChildrenProps as any)}
    >
      <div
        className={cx(
          Classes.TREE_NODE_CONTENT,
          `${Classes.TREE_NODE_CONTENT}-${props.depth}`
        )}
        {...(props.context.itemContainerWithoutChildrenProps as any)}
        {...(props.context.interactiveElementProps as any)}
      >
        {props.item.isFolder ? (
          props.arrow
        ) : (
          <span className={Classes.TREE_NODE_CARET_NONE} />
        )}
        {props.item.data.icon !== undefined ? (
          props.item.data.icon === null ? null : (
            <Icon
              icon={props.item.data.icon}
              className={Classes.TREE_NODE_ICON}
            />
          )
        ) : (
          (() => {
            const icon = !props.item.isFolder
              ? 'document'
              : props.context.isExpanded
              ? 'folder-open'
              : 'folder-close';
            return <Icon icon={icon} className={Classes.TREE_NODE_ICON} />;
          })()
        )}
        {props.title}
      </div>
      <div
        className={cx(Classes.COLLAPSE)}
        style={
          props.context.isExpanded
            ? {
                height: 'auto',
                overflowY: 'visible',
                transition: 'none 0s ease 0s',
              }
            : {}
        }
      >
        <Collapse isOpen={props.context.isExpanded} transitionDuration={0}>
          {props.children}
        </Collapse>
      </div>
    </li>
  ),

  renderItemArrow: props => (
    <Icon
      icon="chevron-right"
      className={cx(
        Classes.TREE_NODE_CARET,
        props.context.isExpanded
          ? Classes.TREE_NODE_CARET_OPEN
          : Classes.TREE_NODE_CARET_CLOSED
      )}
      {...(props.context.arrowProps as any)}
    />
  ),

  renderItemTitle: ({ title, context, info }) => {
    if (!info.isSearching || !context.isSearchMatching) {
      return <span className={Classes.TREE_NODE_LABEL}>{title}</span>;
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

  renderDragBetweenLine: ({ draggingPosition, lineProps }) => (
    <div
      {...lineProps}
      style={{
        position: 'absolute',
        right: '0',
        top:
          draggingPosition.targetType === 'between-items' &&
          draggingPosition.linePosition === 'top'
            ? '0px'
            : draggingPosition.targetType === 'between-items' &&
              draggingPosition.linePosition === 'bottom'
            ? '-4px'
            : '-2px',
        left: `${draggingPosition.depth * 23}px`,
        height: '4px',
        backgroundColor: Colors.BLUE3,
      }}
    />
  ),

  renderRenameInput: props => (
    <form {...props.formProps} style={{ display: 'contents' }}>
      <span className={Classes.TREE_NODE_LABEL}>
        <input
          {...props.inputProps}
          ref={props.inputRef}
          className="rct-tree-item-renaming-input"
        />
      </span>
      <span className={Classes.TREE_NODE_SECONDARY_LABEL}>
        <Button
          icon="tick"
          {...(props.submitButtonProps as any)}
          type="submit"
          minimal
          small
        />
      </span>
    </form>
  ),

  renderSearchInput: props => (
    <div className={cx('rct-tree-search-input-container')}>
      <InputGroup
        autoFocus
        {...(props.inputProps as any)}
        placeholder="Search..."
      />
    </div>
  ),

  renderDepthOffset: 1,
};
