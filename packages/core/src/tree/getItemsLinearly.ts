import { IndividualTreeViewState, TreeItem, TreeItemIndex } from '../types';

export const getItemsLinearly = <T>(
  rootItem: TreeItemIndex,
  viewState: IndividualTreeViewState,
  items: Record<TreeItemIndex, TreeItem<T>>,
  depth = 0
): Array<{ item: TreeItemIndex; depth: number }> => {
  const itemIds: Array<{ item: TreeItemIndex; depth: number }> = [];

  for (const itemId of items[rootItem]?.children ?? []) {
    const item = items[itemId];
    itemIds.push({ item: itemId, depth: depth });
    if (item && item.hasChildren && !!item.children && viewState.expandedItems?.includes(itemId)) {
      itemIds.push(...getItemsLinearly(itemId, viewState, items, depth + 1));
    }
  }

  return itemIds;
};
