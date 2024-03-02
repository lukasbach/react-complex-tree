import { HTMLProps, useMemo } from 'react';
import {
  TreeItem,
  TreeItemActions,
  TreeItemRenderContext,
  TreeItemRenderFlags,
} from '../types';
import { defaultMatcher } from '../search/defaultMatcher';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useInteractionManager } from '../controlledEnvironment/InteractionManagerProvider';
import { useDragAndDrop } from '../drag/DragAndDropProvider';
import { useSelectUpTo } from '../tree/useSelectUpTo';
import { useGetOriginalItemOrder } from '../useGetOriginalItemOrder';

// TODO restructure file. Everything into one hook file without helper methods, let all props be generated outside (InteractionManager and AccessibilityPropsManager), ...

export const useTreeItemRenderContext = (item?: TreeItem) => {
  const { treeId, search, renamingItem, setRenamingItem } = useTree();
  const environment = useTreeEnvironment();
  const interactionManager = useInteractionManager();
  const dnd = useDragAndDrop();
  const selectUpTo = useSelectUpTo('last-focus');
  const itemTitle = item && environment.getItemTitle(item);
  const getOriginalItemOrder = useGetOriginalItemOrder();

  const isSearchMatching = useMemo(
    () =>
      search === null || search.length === 0 || !item || !itemTitle
        ? false
        : (environment.doesSearchMatchItem ?? defaultMatcher)(
            search,
            item,
            itemTitle
          ),
    [search, item, itemTitle, environment.doesSearchMatchItem]
  );

  const isSelected =
    item && environment.viewState[treeId]?.selectedItems?.includes(item.index);
  const isExpanded =
    item && environment.viewState[treeId]?.expandedItems?.includes(item.index);
  const isRenaming = item && renamingItem === item.index;

  return useMemo<TreeItemRenderContext | undefined>(() => {
    if (!item) {
      return undefined;
    }

    const viewState = environment.viewState[treeId];

    const currentlySelectedItems = (
      viewState?.selectedItems?.map(item => environment.items[item]) ??
      (viewState?.focusedItem
        ? [environment.items[viewState?.focusedItem]]
        : [])
    ).filter(item => !!item);

    const isItemPartOfSelectedItems = !!currentlySelectedItems.find(
      selectedItem => selectedItem.index === item.index
    );

    const canDragCurrentlySelectedItems =
      currentlySelectedItems &&
      (environment.canDrag?.(currentlySelectedItems) ?? true) &&
      currentlySelectedItems
        .map(item => item.canMove ?? true)
        .reduce((a, b) => a && b, true);

    const canDragThisItem =
      (environment.canDrag?.([item]) ?? true) && (item.canMove ?? true);

    const canDrag =
      environment.canDragAndDrop &&
      ((isItemPartOfSelectedItems && canDragCurrentlySelectedItems) ||
        (!isItemPartOfSelectedItems && canDragThisItem));

    const canDropOn =
      environment.canDragAndDrop &&
      !!dnd.viableDragPositions?.[treeId]?.find(
        position =>
          position.targetType === 'item' && position.targetItem === item.index
      );

    const actions: TreeItemActions = {
      // TODO disable most actions during rename
      primaryAction: () => {
        environment.onPrimaryAction?.(environment.items[item.index], treeId);
      },
      collapseItem: () => {
        environment.onCollapseItem?.(item, treeId);
      },
      expandItem: () => {
        environment.onExpandItem?.(item, treeId);
      },
      toggleExpandedState: () => {
        if (isExpanded) {
          environment.onCollapseItem?.(item, treeId);
        } else {
          environment.onExpandItem?.(item, treeId);
        }
      },
      selectItem: () => {
        environment.onSelectItems?.([item.index], treeId);
      },
      addToSelectedItems: () => {
        environment.onSelectItems?.(
          [...(viewState?.selectedItems ?? []), item.index],
          treeId
        );
      },
      unselectItem: () => {
        environment.onSelectItems?.(
          viewState?.selectedItems?.filter(id => id !== item.index) ?? [],
          treeId
        );
      },
      selectUpTo: overrideOldSelection => {
        selectUpTo(item, overrideOldSelection);
      },
      startRenamingItem: () => {
        setRenamingItem(item.index);
      },
      stopRenamingItem: () => {
        setRenamingItem(null);
      },
      focusItem: (setDomFocus = true) => {
        environment.onFocusItem?.(item, treeId, setDomFocus);
      },
      startDragging: () => {
        let selectedItems = viewState?.selectedItems ?? [];

        if (!selectedItems.includes(item.index)) {
          selectedItems = [item.index];
          environment.onSelectItems?.(selectedItems, treeId);
        }

        if (canDrag) {
          const orderedItems = getOriginalItemOrder(
            treeId,
            selectedItems.map(id => environment.items[id])
          );
          dnd.onStartDraggingItems(orderedItems, treeId);
        }
      },
    };

    const renderFlags: TreeItemRenderFlags = {
      isSelected,
      isExpanded,
      isFocused: viewState?.focusedItem === item.index,
      isRenaming,
      isDraggingOver:
        dnd.draggingPosition &&
        dnd.draggingPosition.targetType === 'item' &&
        dnd.draggingPosition.targetItem === item.index &&
        dnd.draggingPosition.treeId === treeId,
      isDraggingOverParent: false,
      isSearchMatching,
      canDrag,
      canDropOn,
    };

    const interactiveElementProps: HTMLProps<HTMLElement> = {
      ...interactionManager.createInteractiveElementProps(
        item,
        treeId,
        actions,
        renderFlags,
        viewState
      ),
      ...({
        'data-rct-item-interactive': true,
        'data-rct-item-focus': renderFlags.isFocused ? 'true' : 'false',
        'data-rct-item-id': item.index,
      } as any),
    };

    const itemContainerWithoutChildrenProps: HTMLProps<HTMLElement> = {
      ...({
        'data-rct-item-container': 'true',
      } as any),
    };

    const itemContainerWithChildrenProps: HTMLProps<HTMLElement> = {
      role: 'treeitem',
      'aria-selected': renderFlags.isSelected,
      'aria-expanded': item.isFolder
        ? renderFlags.isExpanded
          ? 'true'
          : 'false'
        : undefined,
    };

    const arrowProps: HTMLProps<HTMLElement> = {
      onClick: () => {
        if (item.isFolder) {
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
    };

    const viewStateFlags = !viewState
      ? {}
      : Object.entries(viewState).reduce((acc, [key, value]) => {
          acc[key] = Array.isArray(value)
            ? value.includes(item.index)
            : value === item.index;
          return acc;
        }, {} as { [key: string]: boolean });

    return {
      ...actions,
      ...renderFlags,
      interactiveElementProps,
      itemContainerWithChildrenProps,
      itemContainerWithoutChildrenProps,
      arrowProps,
      viewStateFlags,
    };
  }, [
    item,
    environment,
    treeId,
    dnd,
    isSelected,
    isExpanded,
    isRenaming,
    isSearchMatching,
    interactionManager,
    selectUpTo,
    setRenamingItem,
    getOriginalItemOrder,
  ]);
};
