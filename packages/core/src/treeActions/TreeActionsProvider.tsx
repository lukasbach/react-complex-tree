import * as React from 'react';
import { PropsWithChildren, useMemo } from 'react';
import {
  TreeChangeActions,
  TreeChangeActionsContextProps,
  TreeItemIndex,
  TreeRef,
} from '../types';
import { useDragAndDrop } from '../drag/DragAndDropProvider';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useCreatedTreeRef } from './useCreatedTreeRef';
import { useTree } from '../tree/Tree';
import { useEnvironmentActions } from '../environmentActions/EnvironmentActionsProvider';

const EnvironmentActionsContext =
  React.createContext<TreeChangeActionsContextProps>(null as any);
export const useTreeActions = () => React.useContext(EnvironmentActionsContext);

export const TreeActionsProvider = React.forwardRef<
  TreeRef,
  PropsWithChildren<Record<string, unknown>>
>((props, ref) => {
  useTreeEnvironment();
  const tree = useTree();
  useDragAndDrop();
  const envActions = useEnvironmentActions();

  // TODO change tree childs to use actions rather than output events where possible
  // TODO maybe replace with stable handlers
  const actions = useMemo<TreeChangeActions>(
    () => ({
      abortRenamingItem(): void {
        tree.setRenamingItem(null);
      },
      abortSearch(): void {
        tree.setSearch(null);
      },
      collapseItem(itemId: TreeItemIndex): void {
        envActions.collapseItem(itemId, tree.treeId);
      },
      completeRenamingItem(): void {
        // TODO
      },
      expandItem(itemId: TreeItemIndex): void {
        envActions.expandItem(itemId, tree.treeId);
      },
      focusItem(itemId: TreeItemIndex, setDomFocus = true): void {
        envActions.focusItem(itemId, tree.treeId, setDomFocus);
      },
      focusTree(autoFocus = true): void {
        envActions.focusTree(tree.treeId, autoFocus);
      },
      invokePrimaryAction(itemId: TreeItemIndex): void {
        envActions.invokePrimaryAction(itemId, tree.treeId);
      },
      moveFocusDown(): void {
        envActions.moveFocusDown(tree.treeId);
      },
      moveFocusUp(): void {
        envActions.moveFocusUp(tree.treeId);
      },
      renameItem(itemId: TreeItemIndex, name: string): void {
        envActions.renameItem(itemId, name, tree.treeId);
      },
      selectItems(itemsIds: TreeItemIndex[]): void {
        envActions.selectItems(itemsIds, tree.treeId);
      },
      setSearch(search: string | null): void {
        tree.setSearch(search);
      },
      startRenamingItem(itemId: TreeItemIndex): void {
        tree.setRenamingItem(itemId);
      },
      stopRenamingItem(): void {
        tree.setRenamingItem(null);
      },
      toggleItemExpandedState(itemId: TreeItemIndex): void {
        envActions.toggleItemExpandedState(itemId, tree.treeId);
      },
      toggleItemSelectStatus(itemId: TreeItemIndex): void {
        envActions.toggleItemSelectStatus(itemId, tree.treeId);
      },
      expandAll(): void {
        envActions.expandAll(tree.treeId);
      },
      collapseAll(): void {
        envActions.collapseAll(tree.treeId);
      },
      expandSubsequently(itemIds: TreeItemIndex[]): Promise<void> {
        return envActions.expandSubsequently(tree.treeId, itemIds);
      },
    }),
    [envActions, tree]
  );

  useCreatedTreeRef(ref, actions);

  return (
    <EnvironmentActionsContext.Provider value={actions}>
      {props.children}
    </EnvironmentActionsContext.Provider>
  );
});
