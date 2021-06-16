import {
  TreeEnvironmentConfiguration,
  TreeItem,
  TreeItemRenderContext,
  TreeItemIndex,
  TreeItemActions, TreeEnvironmentContextProps, IndividualTreeViewState, TreeItemRenderFlags,
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

export const getItemsLinearly = <T>(rootItem: TreeItemIndex, viewState: IndividualTreeViewState, items: Record<TreeItemIndex, TreeItem<T>>, depth = 0): Array<{ item: TreeItemIndex, depth: number }> => {
  let itemIds: Array<{ item: TreeItemIndex, depth: number }> = [];

  for (const itemId of items[rootItem].children ?? []) {
    const item  = items[itemId];
    itemIds.push({ item: itemId, depth: depth });
    if (item.hasChildren && !!item.children && viewState.expandedItems?.includes(itemId)) {
      itemIds.push(...getItemsLinearly(itemId, viewState, items, depth + 1));
    }
  }

  return itemIds;
}

export const createTreeItemRenderContext = <T>(item: TreeItem<T>, environment: TreeEnvironmentContextProps, treeId: string): TreeItemRenderContext => {
  const viewState = environment.viewState[treeId];

  const canDrag = (viewState.selectedItems?.length ?? 0) > 0 ? (viewState.selectedItems
    ?.map(item => environment.items[item]?.canMove)
    .reduce((a, b) => a && b, true) ?? false) : item.canMove;

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
      if (!viewState.selectedItems?.includes(item.index)) {
        environment.onSelectItems?.([item.index], treeId);
      }

      if (canDrag) {
        environment.onStartDraggingItems((viewState.selectedItems ?? []).map(id => environment.items[id]), treeId);
      }
    }
  };

  const renderContext: TreeItemRenderFlags = {
    isSelected: viewState.selectedItems?.includes(item.index),
    isExpanded: viewState.expandedItems?.includes(item.index),
    isFocused: viewState.focusedItem === item.index,
    isRenaming: viewState.renamingItem === item.index,
    isDraggingOver:
      environment.draggingPosition &&
      environment.draggingPosition.targetItem === item.index &&
      environment.draggingPosition.treeId === treeId &&
      environment.draggingPosition.childIndex === undefined,
    isDraggingOverParent: false
  };

  const interactiveElementProps: HTMLProps<HTMLElement> = {
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
  };

  const containerElementProps: HTMLProps<HTMLElement> = {
    ...({
      ['data-rbt-item']: treeId,
    } as any),
  };

  return {
    ...actions,
    ...renderContext,
    interactiveElementProps,
    containerElementProps
  };
};

export const createTreeItemRenderContextDependencies = <T>(item: TreeItem<T> | undefined, environment: TreeEnvironmentConfiguration, treeId: string) => [
  environment,
  environment.viewState.expandedItems,
  item?.index ?? '___no_item',
  treeId
]