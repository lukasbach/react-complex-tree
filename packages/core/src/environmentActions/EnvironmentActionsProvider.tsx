import * as React from 'react';
import { TreeEnvironmentActionsContextProps, TreeEnvironmentRef, TreeItem, TreeItemIndex } from '../types';
import { PropsWithChildren, useCallback } from 'react';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useCreatedEnvironmentRef } from './useCreatedEnvironmentRef';

const EnvironmentActionsContext = React.createContext<TreeEnvironmentActionsContextProps>(null as any);
export const useEnvironmentActions = () => React.useContext(EnvironmentActionsContext);

const recursiveExpand = (itemId: TreeItemIndex, items: Record<TreeItemIndex, TreeItem>, onExpand: (item: TreeItem) => void) => {
  for (const childId of items[itemId]?.children ?? []) {
    const item = items[childId];
    if (item?.hasChildren) {
      onExpand(item);
      recursiveExpand(childId, items, onExpand);
    }
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

  // TODO change environment childs to use actions rather than output events where possible
  const actions: TreeEnvironmentActionsContextProps = {
    abortProgrammaticDrag: useCallback(() => {
      abortProgrammaticDrag();
    }, [abortProgrammaticDrag]),
    collapseItem: useCallback(
      (itemId: TreeItemIndex, treeId: string) => {
        onCollapseItem?.(items[itemId], treeId);
      },
      [items, onCollapseItem]
    ),
    completeProgrammaticDrag: useCallback(() => {
      completeProgrammaticDrag();
    }, [completeProgrammaticDrag]),
    expandItem: useCallback(
      (itemId: TreeItemIndex, treeId: string) => {
        onExpandItem?.(items[itemId], treeId);
      },
      [items, onExpandItem]
    ),
    focusItem: useCallback(
      (itemId: TreeItemIndex, treeId: string) => {
        onFocusItem?.(items[itemId], treeId);
      },
      [items, onFocusItem]
    ),
    focusTree: useCallback(
      (treeId: string, autoFocus = true) => {
        setActiveTree(treeId, autoFocus);
      },
      [setActiveTree]
    ),
    moveFocusDown: useCallback(
      (treeId: string) => {
        const treeLinearItems = linearItems[treeId];
        const currentFocusIndex = treeLinearItems.findIndex(({ item }) => item === viewState[treeId]?.focusedItem);
        const newIndex =
          currentFocusIndex !== undefined ? Math.min(treeLinearItems.length - 1, currentFocusIndex + 1) : 0;
        const newItem = items[treeLinearItems[newIndex].item];
        onFocusItem?.(newItem, treeId);
      },
      [items, linearItems, onFocusItem, viewState]
    ),
    moveFocusUp: useCallback(
      (treeId: string) => {
        const treeLinearItems = linearItems[treeId];
        const currentFocusIndex = treeLinearItems.findIndex(({ item }) => item === viewState[treeId]?.focusedItem);
        const newIndex = currentFocusIndex !== undefined ? Math.max(0, currentFocusIndex - 1) : 0;
        const newItem = items[treeLinearItems[newIndex].item];
        onFocusItem?.(newItem, treeId);
      },
      [items, linearItems, onFocusItem, viewState]
    ),
    moveProgrammaticDragPositionDown: useCallback(() => {
      programmaticDragDown();
    }, [programmaticDragDown]),
    moveProgrammaticDragPositionUp: useCallback(() => {
      programmaticDragUp();
    }, [programmaticDragUp]),
    renameItem: useCallback(
      (itemId: TreeItemIndex, name: string, treeId: string) => {
        onRenameItem?.(items[itemId], name, treeId);
      },
      [items, onRenameItem]
    ),
    selectItems: useCallback(
      (itemsIds: TreeItemIndex[], treeId: string) => {
        onSelectItems?.(itemsIds, treeId);
      },
      [onSelectItems]
    ),
    startProgrammaticDrag: useCallback(() => {
      startProgrammaticDrag();
    }, [startProgrammaticDrag]),
    toggleItemExpandedState: useCallback(
      (itemId: TreeItemIndex, treeId: string) => {
        if (viewState[treeId]?.expandedItems?.includes(itemId)) {
          onCollapseItem?.(items[itemId], treeId);
        } else {
          onExpandItem?.(items[itemId], treeId);
        }
      },
      [items, onCollapseItem, onExpandItem, viewState]
    ),
    toggleItemSelectStatus: useCallback(
      (itemId: TreeItemIndex, treeId: string) => {
        if (viewState[treeId]?.selectedItems?.includes(itemId)) {
          onSelectItems?.(viewState[treeId]!.selectedItems?.filter(item => item !== itemId) ?? [], treeId);
        } else {
          onSelectItems?.([...(viewState[treeId]!.selectedItems ?? []), itemId], treeId);
        }
      },
      [onSelectItems, viewState]
    ),
    invokePrimaryAction: useCallback(
      (itemId, treeId) => {
        onPrimaryAction?.(items[itemId], treeId);
      },
      [items, onPrimaryAction]
    ),
    expandAll: useCallback(
      (treeId: string) => {
        recursiveExpand(trees[treeId].rootItem, items, item => {
          onExpandItem?.(item, treeId);
        });
      }, [items, onExpandItem, trees]),
    collapseAll: useCallback(
      (treeId: string) => {
        for (const itemId of viewState[treeId]?.expandedItems ?? []) {
          onCollapseItem?.(items[itemId], treeId);
        }
      }, [items, onCollapseItem, viewState]),
  };

  useCreatedEnvironmentRef(ref, actions);

  return <EnvironmentActionsContext.Provider value={actions}>{props.children}</EnvironmentActionsContext.Provider>;
});
