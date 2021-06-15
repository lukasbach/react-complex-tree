import {
  TreeEnvironmentConfiguration,
  TreeItem,
  TreeItemRenderContext,
  TreeItemIndex,
  TreeItemActions, TreeEnvironmentContextProps,
} from './types';
import { HTMLProps } from 'react';
import { act } from 'react-dom/test-utils';
import { action } from '@storybook/addon-actions';

// const isArraysEqual = <T>(arr1: T[], arr2: T[]) => {
//   return arr1.length === arr2.length && arr1.reduce((aggr, v1, idx) => aggr && v1 === arr2[idx], true);
// };
//
// export const isItemExpanded = (environment: TreeEnvironmentConfiguration, path: TreeItemPath) => {
//   return !!environment.expandedItems?.find(item => isArraysEqual(item, path));
// }

// export const getItemIdFromPath = (path: TreeItemPath) => {
//   return path[path.length - 1];
// };

export const countVisibleChildrenIncludingSelf = (environment: TreeEnvironmentConfiguration, itemId: TreeItemIndex, treeId: string): number => {
  const item = environment.items[itemId];
  const isExpanded = environment.viewState[treeId].expandedItems?.includes(itemId);
  return 1 + (isExpanded ? item.children?.map(id => countVisibleChildrenIncludingSelf(environment, id, treeId))?.reduce((a, b) => a + b, 0) ?? 0 : 0);
};

export const getLinearIndexOfItem = (environment: TreeEnvironmentConfiguration, itemId: TreeItemIndex): number => {
  return -1;
}

export const getItemPathAtLinearIndex = (environment: TreeEnvironmentConfiguration, rootItem: TreeItemIndex, linearIndex: number): TreeItemIndex | undefined => {
  return undefined;
}

export const createTreeItemRenderContext = <T>(item: TreeItem<T>, environment: TreeEnvironmentContextProps, treeId: string): TreeItemRenderContext => {
  const viewState = environment.viewState[treeId];

  const canDrag = (viewState.selectedItems?.length ?? 0) > 0 && (viewState.selectedItems
    ?.map(item => environment.items[item]?.canMove)
    .reduce((a, b) => a && b, true) ?? false);

  const actions: TreeItemActions = {
    collapseItem: () => {
      environment.onCollapseItem?.(item, treeId);
    },
    expandItem: () => {
      environment.onExpandItem?.(item, treeId);
    },
    toggleExpandedState: () => {
      if (viewState.expandedItems?.includes(item.index)) {
        environment.onCollapseItem?.(item, treeId);
      } else {
        environment.onExpandItem?.(item, treeId);
      }
    },
    selectItem: () => {
      environment.onSelectItems?.([item.index], treeId);
    },
    addToSelectedItems: () => {
      environment.onSelectItems?.([...viewState.selectedItems ?? [], item.index], treeId);
    },
    unselectItem: () => {
      environment.onSelectItems?.(viewState.selectedItems?.filter(id => id !== item.index) ?? [], treeId);
    },
    truncateItem: () => {
    },
    untruncateItem: () => {
    },
    toggleTruncatedState: () => {
    },
    startRenamingItem: () => {
    },
    startDragging: () => {
      if (canDrag) {
        environment.onStartDraggingItems((viewState.selectedItems ?? []).map(id => environment.items[id]), treeId);
      }
    }
  };

  const renderContext = {
    isSelected: viewState.selectedItems?.includes(item.index),
    isExpanded: viewState.expandedItems?.includes(item.index),
    isFocused: viewState.focusedItem === item.index,
    isRenaming: viewState.renamingItem === item.index,
  };

  const itemContainerProps: HTMLProps<HTMLElement> = {
    onClick: (e) => {
      if (e.ctrlKey) {
        if (renderContext.isSelected) {
          actions.unselectItem();
        } else {
          actions.addToSelectedItems();
        }
      } else {
        if (item.hasChildren) {
          actions.toggleExpandedState();
        }
        actions.selectItem();
      }
    },
    onDoubleClick: () => {
      if (item.hasChildren) {
        // actions.toggleExpandedState();
      } else {
        environment.onPrimaryAction?.(item, treeId);
      }
      // actions.selectItem();
    },
    draggable: canDrag,
    onDragStart: e => {
      actions.startDragging();
    },
    ...({
      ['data-rbt-item']: treeId,
    } as any),
  };

  return {
    ...actions,
    ...renderContext,
    itemContainerProps,
  };
};

export const createTreeItemRenderContextDependencies = <T>(item: TreeItem<T> | undefined, environment: TreeEnvironmentConfiguration, treeId: string) => [
  environment,
  environment.viewState.expandedItems,
  item?.index ?? '___no_item',
  treeId
]