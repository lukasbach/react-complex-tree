import * as React from 'react';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import {
  TreeEnvironmentActionsContextProps,
  TreeEnvironmentRef,
  TreeItem,
  TreeItemIndex,
} from '../types';
import { useDragAndDrop } from '../drag/DragAndDropProvider';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useCreatedEnvironmentRef } from './useCreatedEnvironmentRef';
import { useRefCopy } from '../useRefCopy';
import { waitFor } from '../waitFor';

const EnvironmentActionsContext =
  React.createContext<TreeEnvironmentActionsContextProps>(null as any);
export const useEnvironmentActions = () =>
  React.useContext(EnvironmentActionsContext);

const recursiveExpand = async (
  itemId: TreeItemIndex,
  items: React.RefObject<Record<TreeItemIndex, TreeItem>>,
  onExpand: (item: TreeItem) => Promise<void> | void
) => {
  for (const childId of items.current?.[itemId]?.children ?? []) {
    waitFor(() => !!items.current?.[childId]).then(() => {
      const item = items.current?.[childId];
      if (item?.isFolder) {
        onExpand(item);
        recursiveExpand(childId, items, onExpand);
      }
    });
  }
};

export const EnvironmentActionsProvider = React.forwardRef<
  TreeEnvironmentRef,
  PropsWithChildren<Record<string, unknown>>
>((props, ref) => {
  const {
    onCollapseItem,
    items,
    trees,
    viewState,
    onExpandItem,
    onFocusItem,
    setActiveTree,
    onRenameItem,
    onSelectItems,
    onPrimaryAction,
    linearItems,
  } = useTreeEnvironment();
  const {
    abortProgrammaticDrag,
    completeProgrammaticDrag,
    programmaticDragDown,
    programmaticDragUp,
    startProgrammaticDrag,
  } = useDragAndDrop();

  const itemsRef = useRefCopy(items);

  // TODO replace callbacks with stable handlers
  const collapseItem = useCallback(
    (itemId: TreeItemIndex, treeId: string) => {
      onCollapseItem?.(items[itemId], treeId);
    },
    [items, onCollapseItem]
  );

  const expandItem = useCallback(
    (itemId: TreeItemIndex, treeId: string) => {
      onExpandItem?.(items[itemId], treeId);
    },
    [items, onExpandItem]
  );

  const focusItem = useCallback(
    (itemId: TreeItemIndex, treeId: string, setDomFocus = true) => {
      onFocusItem?.(items[itemId], treeId, setDomFocus);
    },
    [items, onFocusItem]
  );

  const focusTree = useCallback(
    (treeId: string, autoFocus = true) => {
      setActiveTree(treeId, autoFocus);
    },
    [setActiveTree]
  );

  const moveFocusDown = useCallback(
    (treeId: string) => {
      const treeLinearItems = linearItems[treeId];
      const currentFocusIndex = treeLinearItems.findIndex(
        ({ item }) => item === viewState[treeId]?.focusedItem
      );
      const newIndex =
        currentFocusIndex !== undefined
          ? Math.min(treeLinearItems.length - 1, currentFocusIndex + 1)
          : 0;
      const newItem = items[treeLinearItems[newIndex].item];
      onFocusItem?.(newItem, treeId);
    },
    [items, linearItems, onFocusItem, viewState]
  );

  const moveFocusUp = useCallback(
    (treeId: string) => {
      const treeLinearItems = linearItems[treeId];
      const currentFocusIndex = treeLinearItems.findIndex(
        ({ item }) => item === viewState[treeId]?.focusedItem
      );
      const newIndex =
        currentFocusIndex !== undefined
          ? Math.max(0, currentFocusIndex - 1)
          : 0;
      const newItem = items[treeLinearItems[newIndex].item];
      onFocusItem?.(newItem, treeId);
    },
    [items, linearItems, onFocusItem, viewState]
  );

  const renameItem = useCallback(
    (itemId: TreeItemIndex, name: string, treeId: string) => {
      onRenameItem?.(items[itemId], name, treeId);
    },
    [items, onRenameItem]
  );

  const selectItems = useCallback(
    (itemsIds: TreeItemIndex[], treeId: string) => {
      onSelectItems?.(itemsIds, treeId);
    },
    [onSelectItems]
  );

  const toggleItemExpandedState = useCallback(
    (itemId: TreeItemIndex, treeId: string) => {
      if (viewState[treeId]?.expandedItems?.includes(itemId)) {
        onCollapseItem?.(items[itemId], treeId);
      } else {
        onExpandItem?.(items[itemId], treeId);
      }
    },
    [items, onCollapseItem, onExpandItem, viewState]
  );

  const toggleItemSelectStatus = useCallback(
    (itemId: TreeItemIndex, treeId: string) => {
      if (viewState[treeId]?.selectedItems?.includes(itemId)) {
        onSelectItems?.(
          viewState[treeId]!.selectedItems?.filter(item => item !== itemId) ??
            [],
          treeId
        );
      } else {
        onSelectItems?.(
          [...(viewState[treeId]!.selectedItems ?? []), itemId],
          treeId
        );
      }
    },
    [onSelectItems, viewState]
  );

  const invokePrimaryAction = useCallback(
    (itemId, treeId) => {
      onPrimaryAction?.(items[itemId], treeId);
    },
    [items, onPrimaryAction]
  );

  const expandSubsequently = useCallback(
    async (treeId: string, itemIds: TreeItemIndex[]) => {
      const [current, ...rest] = itemIds;
      await waitFor(() => !!itemsRef.current?.[current]).then(() => {
        const item = itemsRef.current[current];
        if (!item) {
          return Promise.resolve();
        }
        onExpandItem?.(item, treeId);
        if (rest.length > 0) {
          return expandSubsequently(treeId, rest);
        }
        return Promise.resolve();
      });
    },
    [itemsRef, onExpandItem]
  );

  const expandAll = useCallback(
    async (treeId: string) => {
      await recursiveExpand(trees[treeId].rootItem, itemsRef, item =>
        onExpandItem?.(item, treeId)
      );
    },
    [itemsRef, onExpandItem, trees]
  );

  const collapseAll = useCallback(
    (treeId: string) => {
      for (const itemId of viewState[treeId]?.expandedItems ?? []) {
        onCollapseItem?.(items[itemId], treeId);
      }
    },
    [items, onCollapseItem, viewState]
  );

  // TODO change environment childs to use actions rather than output events where possible
  const actions = useMemo<TreeEnvironmentActionsContextProps>(
    () => ({
      collapseItem,
      expandItem,
      focusItem,
      focusTree,
      moveFocusDown,
      moveFocusUp,
      renameItem,
      selectItems,
      toggleItemExpandedState,
      toggleItemSelectStatus,
      invokePrimaryAction,
      expandAll,
      expandSubsequently,
      collapseAll,
      abortProgrammaticDrag,
      completeProgrammaticDrag,
      moveProgrammaticDragPositionDown: programmaticDragDown,
      moveProgrammaticDragPositionUp: programmaticDragUp,
      startProgrammaticDrag,
    }),
    [
      collapseItem,
      expandItem,
      focusItem,
      focusTree,
      moveFocusDown,
      moveFocusUp,
      renameItem,
      selectItems,
      toggleItemExpandedState,
      toggleItemSelectStatus,
      invokePrimaryAction,
      expandAll,
      expandSubsequently,
      collapseAll,
      abortProgrammaticDrag,
      completeProgrammaticDrag,
      programmaticDragDown,
      programmaticDragUp,
      startProgrammaticDrag,
    ]
  );

  useCreatedEnvironmentRef(ref, actions);

  return (
    <EnvironmentActionsContext.Provider value={actions}>
      {props.children}
    </EnvironmentActionsContext.Provider>
  );
});
