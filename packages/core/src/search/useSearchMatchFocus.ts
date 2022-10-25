import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { defaultMatcher } from './defaultMatcher';
import { useSideEffect } from '../useSideEffect';
import { useLinearItems } from '../controlledEnvironment/useLinearItems';
import { useCallSoon } from '../useCallSoon';

export const useSearchMatchFocus = () => {
  const { doesSearchMatchItem, items, getItemTitle, onFocusItem } =
    useTreeEnvironment();
  const { search, treeId } = useTree();
  const linearItems = useLinearItems(treeId);
  const callSoon = useCallSoon();

  useSideEffect(
    () => {
      if (search && search.length > 0) {
        callSoon(() => {
          const focusItem = linearItems.find(({ item }) =>
            (doesSearchMatchItem ?? defaultMatcher)(
              search,
              items[item],
              getItemTitle(items[item])
            )
          );

          if (focusItem) {
            onFocusItem?.(items[focusItem.item], treeId);
          }
        });
      }
    },
    [
      doesSearchMatchItem,
      getItemTitle,
      linearItems,
      items,
      onFocusItem,
      search,
      treeId,
      callSoon,
    ],
    [search]
  );
};
