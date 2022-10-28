import { useCallback, useRef } from 'react';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItem, TreeItemIndex } from '../types';
import { useLinearItems } from '../controlledEnvironment/useLinearItems';

const usePrevious = <T>(value: T) => {
  const ref = useRef<{ target: T; previous?: T }>({
    target: value,
    previous: undefined,
  });
  if (ref.current.target !== value) {
    ref.current.previous = ref.current.target;
    ref.current.target = value;
  }
  return ref.current.previous;
};

export const useSelectUpTo = (startingAt: 'last-focus' | 'first-selected') => {
  const viewState = useViewState();
  const { treeId } = useTree();
  const linearItems = useLinearItems(treeId);
  const { onSelectItems } = useTreeEnvironment();
  const focusedItemPrevious = usePrevious(viewState.focusedItem);

  return useCallback(
    (item: TreeItem, overrideOldSelection = false) => {
      const itemIndex = item.index;
      const selectMergedItems = (
        oldSelection: TreeItemIndex[],
        newSelection: TreeItemIndex[]
      ) => {
        const merged = [
          ...(overrideOldSelection ? [] : oldSelection),
          ...newSelection.filter(
            i => overrideOldSelection || !oldSelection.includes(i)
          ),
        ];
        onSelectItems?.(merged, treeId);
      };

      if (
        viewState &&
        viewState.selectedItems &&
        viewState.selectedItems.length > 0
      ) {
        // Depending on whether focusItem() or selectUpTo() was called first, which item was the last focused item depends
        const lastFocus =
          viewState.focusedItem === itemIndex
            ? focusedItemPrevious
            : viewState.focusedItem;

        const selectionStart =
          startingAt === 'last-focus'
            ? linearItems.findIndex(linearItem => lastFocus === linearItem.item)
            : linearItems.findIndex(linearItem =>
                viewState.selectedItems?.includes(linearItem.item)
              );
        const selectionEnd = linearItems.findIndex(
          linearItem => linearItem.item === itemIndex
        );

        if (selectionStart < selectionEnd) {
          const selection = linearItems
            .slice(selectionStart, selectionEnd + 1)
            .map(({ item }) => item);
          selectMergedItems(viewState.selectedItems ?? [], selection);
        } else {
          const selection = linearItems
            .slice(selectionEnd, selectionStart + 1)
            .map(({ item }) => item);
          selectMergedItems(viewState.selectedItems ?? [], selection);
        }
      } else {
        onSelectItems?.([itemIndex], treeId);
      }
    },
    [
      viewState,
      onSelectItems,
      treeId,
      startingAt,
      linearItems,
      focusedItemPrevious,
    ]
  );
};
