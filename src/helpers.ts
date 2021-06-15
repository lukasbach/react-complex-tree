import {
  TreeEnvironmentConfiguration,
  TreeItem,
  TreeItemRenderContext,
  TreeItemIndex,
  TreeItemActions,
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

export const countVisibleChildrenIncludingSelf = (environment: TreeEnvironmentConfiguration, itemId: TreeItemIndex): number => {
  const item = environment.items[itemId];
  const isExpanded = environment.viewState.expandedItems?.includes(itemId);
  return 1 + (isExpanded ? item.children?.map(id => countVisibleChildrenIncludingSelf(environment, id))?.reduce((a, b) => a + b, 0) ?? 0 : 0);
};

export const getLinearIndexOfItem = (environment: TreeEnvironmentConfiguration, itemId: TreeItemIndex): number => {
  return -1;
}

export const getItemPathAtLinearIndex = (environment: TreeEnvironmentConfiguration, rootItem: TreeItemIndex, linearIndex: number): TreeItemIndex | undefined => {
  return undefined;
}

export const createTreeItemRenderContext = <T>(item: TreeItem<T>, environment: TreeEnvironmentConfiguration): TreeItemRenderContext => {
  const actions: TreeItemActions = {
    collapseItem: () => {
      environment.onCollapseItem?.(item);
    },
    expandItem: () => {
      environment.onExpandItem?.(item);
    },
    toggleExpandedState: () => {
      if (environment.viewState.expandedItems?.includes(item.index)) {
        environment.onCollapseItem?.(item);
      } else {
        environment.onExpandItem?.(item);
      }
    },
    selectItem: () => {
      environment.onSelectItems?.([item.index]);
    },
    addToSelectedItems: () => {
      environment.onSelectItems?.([...environment.viewState.selectedItems ?? [], item.index]);
    },
    unselectItem: () => {
      environment.onSelectItems?.(environment.viewState.selectedItems?.filter(id => id !== item.index) ?? []);
    },
    truncateItem: () => {
    },
    untruncateItem: () => {
    },
    toggleTruncatedState: () => {
    },
    startRenamingItem: () => {
    },
  };

  const renderContext = {
    isSelected: environment.viewState.selectedItems?.includes(item.index),
    isExpanded: environment.viewState.expandedItems?.includes(item.index),
    isFocused: environment.viewState.focusedItem === item.index,
    isRenaming: environment.viewState.renamingItem === item.index,
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
        environment.onPrimaryAction?.(item);
      }
      // actions.selectItem();
    },
  };

  return {
    ...actions,
    ...renderContext,
    itemContainerProps,
  };
};

export const createTreeItemRenderContextDependencies = <T>(item: TreeItem<T>, environment: TreeEnvironmentConfiguration) => [
  environment,
  environment.viewState.expandedItems,
  item.index
]