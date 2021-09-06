import { TreeItem, TreeItemActions, TreeItemRenderFlags } from '../types';
import { HTMLProps, useMemo } from 'react';
import { defaultMatcher } from '../search/defaultMatcher';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useInteractionManager } from '../controlledEnvironment/InteractionManagerProvider';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { useSelectUpTo } from '../tree/useSelectUpTo';

// TODO restructure file. Everything into one hook file without helper methods, let all props be generated outside (InteractionManager and AccessibilityPropsManager), ...

export const useTreeItemRenderContext = (item?: TreeItem) => {
  const { treeId, search, renamingItem } = useTree();
  const environment = useTreeEnvironment();
  const interactionManager = useInteractionManager();
  const dnd = useDragAndDrop();
  const selectUpTo = useSelectUpTo();
  const itemTitle = item && environment.getItemTitle(item);

  const isSearchMatching = useMemo(() => {
    return search === null || search.length === 0 || !item || !itemTitle
      ? false
      : (environment.doesSearchMatchItem ?? defaultMatcher)(search, item, itemTitle);
  }, [search, itemTitle]);

  return useMemo(() => {
    if (!item) {
      return undefined;
    }

    const viewState = environment.viewState[treeId];

    const currentlySelectedItems =
      viewState?.selectedItems?.map(item => environment.items[item]) ??
      (viewState?.focusedItem ? [environment.items[viewState?.focusedItem]] : []);

    const isItemPartOfSelectedItems = !!currentlySelectedItems.find(selectedItem => selectedItem.index === item.index);

    const canDragCurrentlySelectedItems =
      currentlySelectedItems &&
      (environment.canDrag?.(currentlySelectedItems) ?? true) &&
      currentlySelectedItems.map(item => item.canMove ?? true).reduce((a, b) => a && b, true);

    const canDragThisItem = (environment.canDrag?.([item]) ?? true) && (item.canMove ?? true);

    const canDrag =
      environment.canDragAndDrop &&
      ((isItemPartOfSelectedItems && canDragCurrentlySelectedItems) || (!isItemPartOfSelectedItems && canDragThisItem));

    const canDropOn =
      environment.canDragAndDrop &&
      !!dnd.viableDragPositions?.[treeId]?.find(
        position => position.targetType === 'item' && position.targetItem === item.index
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
        environment.onSelectItems?.([...(viewState?.selectedItems ?? []), item.index], treeId);
      },
      unselectItem: () => {
        environment.onSelectItems?.(viewState?.selectedItems?.filter(id => id !== item.index) ?? [], treeId);
      },
      selectUpTo: () => {
        selectUpTo(item);
      },
      truncateItem: () => {},
      untruncateItem: () => {},
      toggleTruncatedState: () => {},
      startRenamingItem: () => {},
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
          dnd.onStartDraggingItems(
            selectedItems.map(id => environment.items[id]),
            treeId
          );
        }
      },
    };

    const renderFlags: TreeItemRenderFlags = {
      isSelected: viewState?.selectedItems?.includes(item.index),
      isExpanded: viewState?.expandedItems?.includes(item.index),
      isFocused: viewState?.focusedItem === item.index,
      isRenaming: renamingItem === item.index,
      isDraggingOver:
        dnd.draggingPosition &&
        dnd.draggingPosition.targetType === 'item' &&
        dnd.draggingPosition.targetItem === item.index &&
        dnd.draggingPosition.treeId === treeId,
      isDraggingOverParent: false,
      isSearchMatching: isSearchMatching,
      canDrag,
      canDropOn,
    };

    const interactiveElementProps: HTMLProps<HTMLElement> = {
      ...interactionManager.createInteractiveElementProps(item, treeId, actions, renderFlags),
      ...({
        ['data-rct-item-interactive']: true,
        ['data-rct-item-focus']: renderFlags.isFocused ? 'true' : 'false',
        ['data-rct-item-id']: item.index,
      } as any),
    };

    const itemContainerWithoutChildrenProps: HTMLProps<HTMLElement> = {
      ...({
        ['data-rct-item-container']: 'true',
      } as any),
    };

    const itemContainerWithChildrenProps: HTMLProps<HTMLElement> = {
      role: 'treeitem',
      'aria-selected': renderFlags.isSelected,
      'aria-expanded': item.hasChildren ? (renderFlags.isExpanded ? 'true' : 'false') : undefined,
    };

    const arrowProps: HTMLProps<HTMLElement> = {
      onClick: () => {
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
      ...renderFlags,
      interactiveElementProps,
      itemContainerWithChildrenProps,
      itemContainerWithoutChildrenProps,
      arrowProps,
    };
  }, [
    environment,
    environment.viewState[treeId]?.expandedItems,
    environment.viewState[treeId]?.selectedItems,
    renamingItem && renamingItem === item?.index,
    item?.index ?? '___no_item',
    treeId,
    isSearchMatching,
    dnd.draggingPosition,
  ]);
};
