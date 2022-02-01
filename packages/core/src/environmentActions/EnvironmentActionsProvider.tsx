import * as React from 'react';
import { TreeEnvironmentActionsContextProps, TreeEnvironmentRef, TreeItemIndex } from '../types';
import { PropsWithChildren, useCallback } from 'react';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useCreatedEnvironmentRef } from './useCreatedEnvironmentRef';

const EnvironmentActionsContext = React.createContext<TreeEnvironmentActionsContextProps>(null as any);
export const useEnvironmentActions = () => React.useContext(EnvironmentActionsContext);

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
  } = useTreeEnvironment();
  const {
    abortProgrammaticDrag,
    completeProgrammaticDrag,
    programmaticDragDown,
    programmaticDragUp,
    startProgrammaticDrag,
  } = useDragAndDrop();

  // TODO change environment childs to use actions rather than output events where possible
  const actions: TreeEnvironmentActionsContextProps = {
    abortProgrammaticDrag: useCallback(() => {
      abortProgrammaticDrag();
    }, [abortProgrammaticDrag]),
    collapseItem: useCallback((itemId: TreeItemIndex, treeId: string) => {
      onCollapseItem?.(items[itemId], treeId);
    }, [items, onCollapseItem]),
    completeProgrammaticDrag: useCallback(() => {
      completeProgrammaticDrag();
    }, [completeProgrammaticDrag]),
    expandItem: useCallback((itemId: TreeItemIndex, treeId: string) => {
      onExpandItem?.(items[itemId], treeId);
    }, [items, onExpandItem]),
    focusItem: useCallback((itemId: TreeItemIndex, treeId: string) => {
      onFocusItem?.(items[itemId], treeId);
    }, [items, onFocusItem]),
    focusTree: useCallback((treeId: string, autoFocus = true) => {
      setActiveTree(treeId, autoFocus);
    }, [setActiveTree]),
    moveFocusDown: useCallback((treeId: string) => {
      const tree = trees[treeId];
      const linearItems = getItemsLinearly(tree.rootItem, viewState[treeId] ?? {}, items);
      const currentFocusIndex = linearItems.findIndex(
        ({ item }) => item === viewState[treeId]?.focusedItem
      );
      const newIndex = currentFocusIndex !== undefined ? Math.min(linearItems.length - 1, currentFocusIndex + 1) : 0;
      const newItem = items[linearItems[newIndex].item];
      onFocusItem?.(newItem, treeId);
    }, [items, onFocusItem, trees, viewState]),
    moveFocusUp: useCallback((treeId: string) => {
      const tree = trees[treeId];
      const linearItems = getItemsLinearly(tree.rootItem, viewState[treeId] ?? {}, items);
      const currentFocusIndex = linearItems.findIndex(
        ({ item }) => item === viewState[treeId]?.focusedItem
      );
      const newIndex = currentFocusIndex !== undefined ? Math.max(0, currentFocusIndex - 1) : 0;
      const newItem = items[linearItems[newIndex].item];
      onFocusItem?.(newItem, treeId);
    }, [items, onFocusItem, trees, viewState]),
    moveProgrammaticDragPositionDown: useCallback(() => {
      programmaticDragDown();
    }, [programmaticDragDown]),
    moveProgrammaticDragPositionUp: useCallback(() => {
      programmaticDragUp();
    }, [programmaticDragUp]),
    renameItem: useCallback((itemId: TreeItemIndex, name: string, treeId: string) => {
      onRenameItem?.(items[itemId], name, treeId);
    }, [items, onRenameItem]),
    selectItems: useCallback((itemsIds: TreeItemIndex[], treeId: string) => {
      onSelectItems?.(itemsIds, treeId);
    }, [onSelectItems]),
    startProgrammaticDrag: useCallback(() => {
      startProgrammaticDrag();
    }, [startProgrammaticDrag]),
    toggleItemExpandedState: useCallback((itemId: TreeItemIndex, treeId: string) => {
      if (viewState[treeId]?.expandedItems?.includes(itemId)) {
        onCollapseItem?.(items[itemId], treeId);
      } else {
        onExpandItem?.(items[itemId], treeId);
      }
    }, [items, onCollapseItem, onExpandItem, viewState]),
    toggleItemSelectStatus: useCallback((itemId: TreeItemIndex, treeId: string) => {
      if (viewState[treeId]?.selectedItems?.includes(itemId)) {
        onSelectItems?.(
          viewState[treeId]!.selectedItems?.filter(item => item !== itemId) ?? [],
          treeId
        );
      } else {
        onSelectItems?.([...(viewState[treeId]!.selectedItems ?? []), itemId], treeId);
      }
    }, [onSelectItems, viewState]),
    invokePrimaryAction: useCallback((itemId, treeId) => {
      onPrimaryAction?.(items[itemId], treeId);
    }, [items, onPrimaryAction]),
  };

  useCreatedEnvironmentRef(ref, actions);

  return <EnvironmentActionsContext.Provider value={actions}>{props.children}</EnvironmentActionsContext.Provider>;
});
