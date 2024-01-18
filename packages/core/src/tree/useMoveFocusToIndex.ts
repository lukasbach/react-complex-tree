import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useLinearItems } from '../controlledEnvironment/useLinearItems';
import { LinearItem } from '../types';
import { useStableHandler } from '../useStableHandler';

export const useMoveFocusToIndex = () => {
  const { treeId } = useTree();
  const { onFocusItem, items } = useTreeEnvironment();
  const linearItems = useLinearItems(treeId);
  const viewState = useViewState();

  return useStableHandler(
    (
      computeNewIndex: (
        currentIndex: number,
        linearItems: LinearItem[]
      ) => number
    ) => {
      const currentIndex =
        linearItems.findIndex(item => item.item === viewState.focusedItem) ?? 0;
      const newIndex = computeNewIndex(currentIndex, linearItems);
      const newIndexBounded = Math.max(
        0,
        Math.min(linearItems.length - 1, newIndex)
      );
      const newFocusItem = items[linearItems[newIndexBounded].item];
      onFocusItem?.(newFocusItem, treeId);
      return newFocusItem;
    }
  );
};
