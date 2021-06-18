import type { getItemsLinearly } from './getItemsLinearly';
import { useContext } from 'react';
import { TreeConfigurationContext } from './Tree';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useGetLinearItems } from './useGetLinearItems';
import { useViewState } from './useViewState';

export const useMoveFocusToIndex = (containerRef?: HTMLElement) => {
  const { treeId, rootItem } = useContext(TreeConfigurationContext);
  const getLinearItems = useGetLinearItems(treeId, rootItem);
  const environment = useContext(TreeEnvironmentContext);
  const viewState = useViewState();

  return (computeNewIndex: (currentIndex: number, linearItems: ReturnType<typeof getItemsLinearly>) => number) => {
    const linearItems = getLinearItems();
    const currentIndex = linearItems.findIndex(item => item.item === viewState.focusedItem) ?? 0;
    const newIndex = computeNewIndex(currentIndex, linearItems);
    const newIndexBounded = Math.max(0, Math.min(linearItems.length - 1, newIndex));
    environment.onFocusItem?.(environment.items[linearItems[newIndexBounded].item], treeId);
  }
}