import { useTree } from '../treeContent/Tree';
import { useEffect } from 'react';
import { useGetLinearItems } from '../treeContent/useGetLinearItems';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { defaultMatcher } from './defaultMatcher';

export const useSearchMatchFocus = () => {
  const { doesSearchMatchItem, items, getItemTitle, onFocusItem } = useTreeEnvironment();
  const { search, treeId } = useTree();
  const getLinearItems = useGetLinearItems();

  useEffect(() => {
    if (search && search.length > 0) {
      requestAnimationFrame(() => {
        const focusItem = getLinearItems().find(({ item }) =>
          (doesSearchMatchItem ?? defaultMatcher)(search, items[item], getItemTitle(items[item])));

        if (focusItem) {
          console.log(`SEARCH FOCUS ON ${focusItem.item}`)
          onFocusItem?.(items[focusItem.item], treeId);
        }
      });
    }
  }, [search])
}