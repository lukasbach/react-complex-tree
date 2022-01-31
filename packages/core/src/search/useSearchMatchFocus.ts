import { useTree } from '../tree/Tree';
import { useGetLinearItems } from '../tree/useGetLinearItems';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { defaultMatcher } from './defaultMatcher';
import { useSideEffect } from '../useSideEffect';

export const useSearchMatchFocus = () => {
  const { doesSearchMatchItem, items, getItemTitle, onFocusItem } = useTreeEnvironment();
  const { search, treeId } = useTree();
  const getLinearItems = useGetLinearItems();

  useSideEffect(
    () => {
      if (search && search.length > 0) {
        requestAnimationFrame(() => {
          const focusItem = getLinearItems().find(({ item }) =>
            (doesSearchMatchItem ?? defaultMatcher)(search, items[item], getItemTitle(items[item]))
          );

          if (focusItem) {
            onFocusItem?.(items[focusItem.item], treeId);
          }
        });
      }
    },
    [doesSearchMatchItem, getItemTitle, getLinearItems, items, onFocusItem, search, treeId],
    [search]
  );
};
