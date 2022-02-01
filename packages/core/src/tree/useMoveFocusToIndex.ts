import type { getItemsLinearly } from './getItemsLinearly';
import { useGetLinearItems } from './useGetLinearItems';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useCallback } from 'react';

export const useMoveFocusToIndex = () => {
  const { treeId } = useTree();
  const { onFocusItem, items } = useTreeEnvironment();
  const getLinearItems = useGetLinearItems();
  const viewState = useViewState();

  return useCallback((computeNewIndex: (currentIndex: number, linearItems: ReturnType<typeof getItemsLinearly>) => number) => {
    const linearItems = getLinearItems();
    const currentIndex = linearItems.findIndex(item => item.item === viewState.focusedItem) ?? 0;
    const newIndex = computeNewIndex(currentIndex, linearItems);
    const newIndexBounded = Math.max(0, Math.min(linearItems.length - 1, newIndex));
    const newFocusItem = items[linearItems[newIndexBounded].item];
    onFocusItem?.(newFocusItem, treeId);
    return newFocusItem;
  }, [onFocusItem, items, getLinearItems, treeId, viewState.focusedItem]);
};
