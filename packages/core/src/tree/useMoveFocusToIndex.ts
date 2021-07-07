import type { getItemsLinearly } from './getItemsLinearly';
import { useGetLinearItems } from './useGetLinearItems';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export const useMoveFocusToIndex = () => {
  const { treeId } = useTree();
  const environment = useTreeEnvironment();
  const getLinearItems = useGetLinearItems();
  const viewState = useViewState();

  return (computeNewIndex: (currentIndex: number, linearItems: ReturnType<typeof getItemsLinearly>) => number) => {
    const linearItems = getLinearItems();
    const currentIndex = linearItems.findIndex(item => item.item === viewState.focusedItem) ?? 0;
    const newIndex = computeNewIndex(currentIndex, linearItems);
    const newIndexBounded = Math.max(0, Math.min(linearItems.length - 1, newIndex));
    const newFocusItem = environment.items[linearItems[newIndexBounded].item];
    environment.onFocusItem?.(newFocusItem, treeId);
    return newFocusItem;
  };
};
