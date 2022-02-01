import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useCallback } from 'react';
import { useLinearItems } from '../controlledEnvironment/useLinearItems';
import { LinearItem } from '../types';

export const useMoveFocusToIndex = () => {
  const { treeId } = useTree();
  const { onFocusItem, items } = useTreeEnvironment();
  const linearItems = useLinearItems(treeId);
  const viewState = useViewState();

  return useCallback(
    (computeNewIndex: (currentIndex: number, linearItems: LinearItem[]) => number) => {
      const currentIndex = linearItems.findIndex(item => item.item === viewState.focusedItem) ?? 0;
      const newIndex = computeNewIndex(currentIndex, linearItems);
      const newIndexBounded = Math.max(0, Math.min(linearItems.length - 1, newIndex));
      const newFocusItem = items[linearItems[newIndexBounded].item];
      onFocusItem?.(newFocusItem, treeId);
      return newFocusItem;
    },
    [onFocusItem, items, linearItems, treeId, viewState.focusedItem]
  );
};
