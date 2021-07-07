import * as React from 'react';
import { TreeEnvironmentActionsContextProps, TreeEnvironmentRef, TreeItemIndex } from '../types';
import { PropsWithChildren } from 'react';
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
  const environment = useTreeEnvironment();
  const dnd = useDragAndDrop();

  // TODO change environment childs to use actions rather than output events where possible
  const actions: TreeEnvironmentActionsContextProps = {
    abortProgrammaticDrag(): void {
      dnd.abortProgrammaticDrag();
    },
    collapseItem(itemId: TreeItemIndex, treeId: string): void {
      environment.onCollapseItem?.(environment.items[itemId], treeId);
    },
    completeProgrammaticDrag(): void {
      dnd.completeProgrammaticDrag();
    },
    expandItem(itemId: TreeItemIndex, treeId: string): void {
      environment.onExpandItem?.(environment.items[itemId], treeId);
    },
    focusItem(itemId: TreeItemIndex, treeId: string): void {
      environment.onFocusItem?.(environment.items[itemId], treeId);
    },
    focusTree(treeId: string, autoFocus = true): void {
      environment.setActiveTree(treeId, autoFocus);
    },
    moveFocusDown(treeId: string): void {
      const tree = environment.trees[treeId];
      const linearItems = getItemsLinearly(tree.rootItem, environment.viewState[treeId] ?? {}, environment.items);
      const currentFocusIndex = linearItems.findIndex(
        ({ item }) => item === environment.viewState[treeId]?.focusedItem
      );
      const newIndex = currentFocusIndex !== undefined ? Math.min(linearItems.length - 1, currentFocusIndex + 1) : 0;
      const newItem = environment.items[linearItems[newIndex].item];
      environment.onFocusItem?.(newItem, treeId);
    },
    moveFocusUp(treeId: string): void {
      const tree = environment.trees[treeId];
      const linearItems = getItemsLinearly(tree.rootItem, environment.viewState[treeId] ?? {}, environment.items);
      const currentFocusIndex = linearItems.findIndex(
        ({ item }) => item === environment.viewState[treeId]?.focusedItem
      );
      const newIndex = currentFocusIndex !== undefined ? Math.max(0, currentFocusIndex - 1) : 0;
      const newItem = environment.items[linearItems[newIndex].item];
      environment.onFocusItem?.(newItem, treeId);
    },
    moveProgrammaticDragPositionDown(): void {
      dnd.programmaticDragDown();
    },
    moveProgrammaticDragPositionUp(): void {
      dnd.programmaticDragUp();
    },
    renameItem(itemId: TreeItemIndex, name: string, treeId: string): void {
      environment.onRenameItem?.(environment.items[itemId], name, treeId);
    },
    selectItems(itemsIds: TreeItemIndex[], treeId: string): void {
      environment.onSelectItems?.(itemsIds, treeId);
    },
    startProgrammaticDrag(): void {
      dnd.startProgrammaticDrag();
    },
    toggleItemExpandedState(itemId: TreeItemIndex, treeId: string): void {
      if (environment.viewState[treeId]?.expandedItems?.includes(itemId)) {
        environment.onCollapseItem?.(environment.items[itemId], treeId);
      } else {
        environment.onExpandItem?.(environment.items[itemId], treeId);
      }
    },
    toggleItemSelectStatus(itemId: TreeItemIndex, treeId: string): void {
      if (environment.viewState[treeId]?.selectedItems?.includes(itemId)) {
        environment.onSelectItems?.(
          environment.viewState[treeId]!.selectedItems?.filter(item => item !== itemId) ?? [],
          treeId
        );
      } else {
        environment.onSelectItems?.([...(environment.viewState[treeId]!.selectedItems ?? []), itemId], treeId);
      }
    },
    invokePrimaryAction(itemId, treeId) {
      environment.onPrimaryAction?.(environment.items[itemId], treeId);
    },
  };

  useCreatedEnvironmentRef(ref, actions);

  return <EnvironmentActionsContext.Provider value={actions}>{props.children}</EnvironmentActionsContext.Provider>;
});
