import {
  IndividualTreeViewState,
  LinearItem,
  TreeItem,
  TreeItemIndex,
} from '../types';

export const getItemsLinearly = <T, C extends string>(
  rootItem: TreeItemIndex,
  viewState: IndividualTreeViewState<C>,
  items: Record<TreeItemIndex, TreeItem<T>>,
  depth = 0
): LinearItem[] => {
  const itemIds: Array<{ item: TreeItemIndex; depth: number }> = [];

  for (const itemId of items[rootItem]?.children ?? []) {
    const item = items[itemId];
    itemIds.push({ item: itemId, depth });
    if (
      item &&
      item.isFolder &&
      !!item.children &&
      viewState.expandedItems?.includes(itemId)
    ) {
      itemIds.push(...getItemsLinearly(itemId, viewState, items, depth + 1));
    }
  }

  return itemIds;
};
