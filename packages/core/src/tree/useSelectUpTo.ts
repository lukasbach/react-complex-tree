import { useCallback } from 'react';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItem } from '../types';
import { useLinearItems } from '../controlledEnvironment/useLinearItems';

export const useSelectUpTo = () => {
  const viewState = useViewState();
  const { treeId } = useTree();
  const linearItems = useLinearItems(treeId);
  const { onSelectItems } = useTreeEnvironment();

  return useCallback(
    (item: TreeItem) => {
      // TODO doesnt work that well if there are spaces between selections
      if (
        viewState &&
        viewState.selectedItems &&
        viewState.selectedItems.length > 0
      ) {
        const selectionStart = linearItems.findIndex(linearItem =>
          viewState.selectedItems?.includes(linearItem.item)
        );
        const selectionEnd = linearItems.findIndex(
          linearItem => linearItem.item === item.index
        );

        if (selectionStart < selectionEnd) {
          const selection = linearItems
            .slice(selectionStart, selectionEnd + 1)
            .map(({ item }) => item);
          onSelectItems?.(
            [...(viewState?.selectedItems ?? []), ...selection],
            treeId
          );
        } else {
          const selection = linearItems
            .slice(selectionEnd, selectionStart)
            .map(({ item }) => item);
          onSelectItems?.(
            [...(viewState?.selectedItems ?? []), ...selection],
            treeId
          );
        }
      } else {
        onSelectItems?.([item.index], treeId);
      }
    },
    [onSelectItems, linearItems, treeId, viewState]
  );
};
