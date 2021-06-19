import {
  TreeEnvironmentConfiguration,
  TreeItem,
  TreeItemRenderContext,
  TreeItemIndex,
  TreeItemActions, TreeEnvironmentContextProps, IndividualTreeViewState, TreeItemRenderFlags, TreeInformation,
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
  const isExpanded = environment.viewState[treeId]?.expandedItems?.includes(itemId);
  return 1 + (isExpanded ? item.children?.map(id => countVisibleChildrenIncludingSelf(environment, id, treeId))?.reduce((a, b) => a + b, 0) ?? 0 : 0);
};

export const getLinearIndexOfItem = (environment: TreeEnvironmentConfiguration, itemId: TreeItemIndex): number => {
  return -1;
}

export const getItemPathAtLinearIndex = (environment: TreeEnvironmentConfiguration, rootItem: TreeItemIndex, linearIndex: number): TreeItemIndex | undefined => {
  return undefined;
}

export const createTreeItemRenderContext = <T>(item: TreeItem<T>, environment: TreeEnvironmentContextProps, treeId: string, isSearchMatching: boolean): TreeItemRenderContext => {
  const viewState = environment.viewState[treeId];

  const selectedItems = viewState?.selectedItems?.map(item => environment.items[item]) ?? [];

  const canDrag = //selectedItems &&
  //  selectedItems.length > 0 &&
    environment.allowDragAndDrop &&
    (environment.canDrag?.(selectedItems) ?? true) &&
    (
      selectedItems
      .map(item => item.canMove ?? true)
      .reduce((a, b) => a && b, true)
    );

  // console.log(canDrag, selectedItems, environment.allowDragAndDrop)

  const actions: TreeItemActions = {
    primaryAction: () => {
      console.log(`PRIMARY ACTION ON ${item.index}`)
      environment.onPrimaryAction?.(environment.items[item.index], treeId);
    },
    collapseItem: () => {
      environment.onCollapseItem?.(item, treeId);
    },
    expandItem: () => {
      environment.onExpandItem?.(item, treeId);
    },
    toggleExpandedState: () => {
      if (viewState?.expandedItems?.includes(item.index)) {
        environment.onCollapseItem?.(item, treeId);
      } else {
        environment.onExpandItem?.(item, treeId);
      }
    },
    selectItem: () => {
      environment.onSelectItems?.([item.index], treeId);
    },
    addToSelectedItems: () => {
      environment.onSelectItems?.([...viewState?.selectedItems ?? [], item.index], treeId);
    },
    unselectItem: () => {
      environment.onSelectItems?.(viewState?.selectedItems?.filter(id => id !== item.index) ?? [], treeId);
    },
    truncateItem: () => {
    },
    untruncateItem: () => {
    },
    toggleTruncatedState: () => {
    },
    startRenamingItem: () => {
    },
    focusItem: () => {
      environment.onFocusItem?.(item, treeId);
    },
    startDragging: () => {
      let selectedItems = viewState?.selectedItems ?? [];

      if (!selectedItems.includes(item.index)) {
        selectedItems = [item.index];
        environment.onSelectItems?.(selectedItems, treeId);
      }

      if (canDrag) {
        environment.onStartDraggingItems((selectedItems).map(id => environment.items[id]), treeId);
      }
    }
  };

  const renderContext: TreeItemRenderFlags = {
    isSelected: viewState?.selectedItems?.includes(item.index),
    isExpanded: viewState?.expandedItems?.includes(item.index),
    isFocused: viewState?.focusedItem === item.index,
    isRenaming: viewState?.renamingItem === item.index,
    isDraggingOver:
      environment.draggingPosition &&
      environment.draggingPosition.targetType === 'item' &&
      environment.draggingPosition.targetItem === item.index &&
      environment.draggingPosition.treeId === treeId,
    isDraggingOverParent: false,
    isSearchMatching: isSearchMatching,
  };

  const interactiveElementProps: HTMLProps<HTMLElement> = {
    onClick: (e) => {
      actions.focusItem();
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

        if (!item.hasChildren || environment.canInvokePrimaryActionOnItemContainer) {
          actions.primaryAction();
        }
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
    onFocus: () => {
      actions.focusItem();
    },
    onDragStart: e => {
      e.dataTransfer.dropEffect = 'copy'; // TODO
      // e.dataTransfer.setDragImage(environment.renderDraggingItem(viewState.selectedItems), 0, 0);
      actions.startDragging();
    },
    onDragOver: e => {
      e.preventDefault(); // Allow drop
    },
    draggable: canDrag,
    ...({
      ['data-rbt-item-interactive']: true,
      ['data-rbt-item-focus']: renderContext.isFocused ? 'true' : 'false',
      ['data-rbt-item-id']: item.index,
    } as any)
  };

  const containerElementProps: HTMLProps<HTMLElement> = {
    ...({
      ['data-rbt-item-container']: 'true',
    } as any),
  };

  return {
    ...actions,
    ...renderContext,
    interactiveElementProps,
    itemContainerElementProps: containerElementProps
  };
};

export const createTreeItemRenderContextDependencies = <T>(item: TreeItem<T> | undefined, environment: TreeEnvironmentConfiguration, treeId: string, isSearchMatching: boolean) => [
  environment,
  environment.viewState[treeId]?.expandedItems,
  environment.viewState[treeId]?.selectedItems,
  item?.index ?? '___no_item',
  treeId,
  isSearchMatching,
];


export const createTreeInformation = <T>(environment: TreeEnvironmentContextProps, treeId: string, search: string | null): TreeInformation => ({
  isFocused: environment.activeTreeId === treeId,
  isRenaming: environment.viewState[treeId]?.renamingItem !== undefined,
  areItemsSelected: (environment.viewState[treeId]?.selectedItems?.length ?? 0) > 0,
  isSearching: search !== null,
  search: search,
});

export const createTreeInformationDependencies = <T>(environment: TreeEnvironmentContextProps, treeId: string, search: string | null) => [
  environment.activeTreeId,
  environment.viewState[treeId]?.renamingItem,
  environment.viewState[treeId]?.selectedItems,
  treeId,
  search,
];
