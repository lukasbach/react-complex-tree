import { getItemsLinearly } from './getItemsLinearly';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItem } from '../types';

export const useSelectUpTo = () => {
  const viewState = useViewState();
  const { rootItem, treeId } = useTree();
  const environment = useTreeEnvironment();

  return (item: TreeItem) => {
    // TODO doesnt work that well if there are spaces between selections
    if (viewState && viewState.selectedItems && viewState.selectedItems.length > 0) {
      const linearItems = getItemsLinearly(rootItem, viewState, environment.items);
      const selectionStart = linearItems.findIndex(linearItem => viewState.selectedItems?.includes(linearItem.item));
      const selectionEnd = linearItems.findIndex(linearItem => linearItem.item === item.index);

      if (selectionStart < selectionEnd) {
        const selection = linearItems.slice(selectionStart, selectionEnd + 1).map(({ item }) => item);
        environment.onSelectItems?.([...(viewState?.selectedItems ?? []), ...selection], treeId);
      } else {
        const selection = linearItems.slice(selectionEnd, selectionStart).map(({ item }) => item);
        environment.onSelectItems?.([...(viewState?.selectedItems ?? []), ...selection], treeId);
      }
    } else {
      environment.onSelectItems?.([item.index], treeId);
    }
  };
};
