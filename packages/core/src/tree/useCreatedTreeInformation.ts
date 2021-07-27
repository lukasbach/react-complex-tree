import { useMemo } from 'react';
import { TreeInformation, TreeItemIndex, TreeProps } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';

export const useCreatedTreeInformation = (
  tree: TreeProps,
  renamingItem: TreeItemIndex | null,
  search: string | null
) => {
  const environment = useTreeEnvironment();
  const dnd = useDragAndDrop();
  return useMemo<TreeInformation>(
    () => ({
      isFocused: environment.activeTreeId === tree.treeId,
      isRenaming: !!renamingItem,
      areItemsSelected: (environment.viewState[tree.treeId]?.selectedItems?.length ?? 0) > 0,
      isSearching: search !== null,
      search,
      isProgrammaticallyDragging: dnd.isProgrammaticallyDragging ?? false,
      treeId: tree.treeId,
      rootItem: tree.rootItem,
    }),
    [
      environment.activeTreeId,
      environment.viewState[tree.treeId]?.selectedItems,
      renamingItem,
      tree.treeId,
      search,
      dnd.isProgrammaticallyDragging,
    ]
  );
};
