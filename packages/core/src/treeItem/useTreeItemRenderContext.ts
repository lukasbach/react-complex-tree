import {
  TreeEnvironmentConfiguration,
  TreeEnvironmentContextProps,
  TreeItem,
  TreeItemActions, TreeItemIndex,
  TreeItemRenderContext,
  TreeItemRenderFlags,
} from '../types';
import { HTMLProps, useMemo } from 'react';
import { defaultMatcher } from '../search/defaultMatcher';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useViewState } from '../tree/useViewState';
import { getItemsLinearly } from '../tree/getItemsLinearly';

const createTreeItemRenderContext = <T>(
  item: TreeItem<T>,
  environment: TreeEnvironmentContextProps,
  treeId: string,
  isSearchMatching: boolean,
  renamingItem: TreeItemIndex | null,
  rootItem: string,
): TreeItemRenderContext => {
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

  const actions: TreeItemActions = { // TODO disable most actions during rename
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
    selectUpTo: () => {
      // TODO doesnt work that well if there are spaces between selections
      if (viewState && viewState.selectedItems && viewState.selectedItems.length > 0) {
        const linearItems = getItemsLinearly(rootItem, viewState, environment.items);
        const selectionStart = linearItems.findIndex(linearItem => viewState.selectedItems?.includes(linearItem.item));
        const selectionEnd = linearItems.findIndex(linearItem => linearItem.item === item.index);

        if (selectionStart < selectionEnd) {
          const selection = linearItems.slice(selectionStart, selectionEnd + 1).map(({ item }) => item);
          environment.onSelectItems?.([...viewState?.selectedItems ?? [], ...selection], treeId);
        } else {
          const selection = linearItems.slice(selectionEnd, selectionStart).map(({ item }) => item);
          environment.onSelectItems?.([...viewState?.selectedItems ?? [], ...selection], treeId);
        }
      } else {
        actions.selectItem();
      }
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
    isRenaming: renamingItem === item.index,
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
      if (e.shiftKey) {
        actions.selectUpTo();
      } else if (e.ctrlKey) {
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
    draggable: canDrag && !renderContext.isRenaming,
    role: 'treeitem',
    'aria-expanded': item.hasChildren ? (renderContext.isExpanded ? 'true' : 'false') : undefined,
    tabIndex: !renderContext.isRenaming ? renderContext.isFocused ? 0 : -1 : undefined,
    ...({
      ['data-rct-item-interactive']: true,
      ['data-rct-item-focus']: renderContext.isFocused ? 'true' : 'false',
      ['data-rct-item-id']: item.index,
    } as any)
  };

  const itemContainerWithoutChildrenProps: HTMLProps<HTMLElement> = {
    ...({
      ['data-rct-item-container']: 'true',
    } as any),
  };

  const itemContainerWithChildrenProps: HTMLProps<HTMLElement> = {
    role: 'none',
  };

  const arrowProps: HTMLProps<HTMLElement> = {
    onClick: e => {
      if (item.hasChildren) {
        actions.toggleExpandedState();
      }
      actions.selectItem();
    },
    onFocus: () => {
      actions.focusItem();
    },
    onDragOver: e => {
      e.preventDefault(); // Allow drop
    },
    'aria-hidden': true,
    tabIndex: -1,
    // TODO alternative interaction modes
  };

  return {
    ...actions,
    ...renderContext,
    interactiveElementProps,
    itemContainerWithChildrenProps,
    itemContainerWithoutChildrenProps,
    arrowProps,
  };
};

const createTreeItemRenderContextDependencies = <T>(
  item: TreeItem<T> | undefined,
  environment: TreeEnvironmentConfiguration,
  treeId: string,
  isSearchMatching: boolean,
  renamingItem: TreeItemIndex | null,
) => [
  environment,
  environment.viewState[treeId]?.expandedItems,
  environment.viewState[treeId]?.selectedItems,
  renamingItem && renamingItem === item?.index,
  item?.index ?? '___no_item',
  treeId,
  isSearchMatching,
];

export const useTreeItemRenderContext = (item?: TreeItem) => {
  const { treeId, search, rootItem, renamingItem } = useTree();
  const environment = useTreeEnvironment();
  const itemTitle = item && environment.getItemTitle(item);

  const isSearchMatching = useMemo(() => {
    return search === null || search.length === 0 || !item || !itemTitle
      ? false : (environment.doesSearchMatchItem ?? defaultMatcher)(search, item, itemTitle);
  }, [search, itemTitle]);

  return useMemo(
    () => item && createTreeItemRenderContext(item, environment, treeId, isSearchMatching, renamingItem, rootItem),
    createTreeItemRenderContextDependencies(item, environment, treeId, isSearchMatching, renamingItem),
  );
};
