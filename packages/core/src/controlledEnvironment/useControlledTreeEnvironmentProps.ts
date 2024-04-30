import { useCallback, useMemo, useState } from 'react';
import {
  ControlledTreeEnvironmentProps,
  TreeChangeHandlers,
  TreeConfiguration,
  TreeEnvironmentContextProps,
} from '../types';
import { scrollIntoView } from '../tree/scrollIntoView';
import { useRenderers } from '../renderers/useRenderers';
import { buildMapForTrees, getDocument } from '../utils';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useRefCopy } from '../useRefCopy';

export const useControlledTreeEnvironmentProps = ({
  onExpandItem: onExpandItemProp,
  onCollapseItem: onCollapseProp,
  onDrop: onDropProp,
  ...props
}: ControlledTreeEnvironmentProps): TreeEnvironmentContextProps => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [activeTreeId, setActiveTreeId] = useState<string>();

  const treeIds = useMemo(() => Object.keys(trees), [trees]);

  const {
    onFocusItem,
    autoFocus,
    onRegisterTree,
    onUnregisterTree,
    items,
    viewState,
  } = props;

  const onFocusItemRef = useRefCopy(onFocusItem);
  const viewStateRef = useRefCopy(viewState);

  const linearItems = useMemo(
    () =>
      buildMapForTrees(treeIds, treeId =>
        getItemsLinearly(trees[treeId].rootItem, viewState[treeId] ?? {}, items)
      ),
    [trees, items, treeIds, viewState]
  );

  const onFocusItemHandler = useCallback<
    Required<TreeChangeHandlers>['onFocusItem']
  >(
    (item, treeId, setDomFocus = true) => {
      if ((autoFocus ?? true) && setDomFocus) {
        const newItem =
          getDocument()?.querySelector(
            `[data-rct-tree="${treeId}"] [data-rct-item-id="${item.index}"]`
          ) ??
          getDocument()?.querySelector(
            `[data-rct-tree="${treeId}"] [data-rct-item-id]`
          );

        if (
          getDocument()?.activeElement?.attributes.getNamedItem(
            'data-rct-search-input'
          )?.value !== 'true'
        ) {
          // Move DOM focus to item if the current focus is not on the search input
          (newItem as HTMLElement)?.focus?.();
        } else {
          // Otherwise just manually scroll into view
          scrollIntoView(newItem);
        }
      }

      if (viewStateRef.current[treeId]?.focusedItem === item.index) {
        return;
      }

      onFocusItemRef.current?.(item, treeId);
    },
    [autoFocus, onFocusItemRef, viewStateRef]
  );

  const registerTree = useCallback(
    tree => {
      setTrees(trees => ({ ...trees, [tree.treeId]: tree }));
      onRegisterTree?.(tree);
    },
    [onRegisterTree]
  );

  const unregisterTree = useCallback(
    treeId => {
      onUnregisterTree?.(trees[treeId]);
      delete trees[treeId];
      setTrees(trees);
    },
    [onUnregisterTree, trees]
  );

  const onCollapseItem = useCallback(
    (item, treeId) => {
      onCollapseProp?.(item, treeId);
      setTrees(trees => trees);
    },
    [onCollapseProp]
  );

  const onExpandItem = useCallback(
    (item, treeId) => {
      onExpandItemProp?.(item, treeId);
      setTrees(trees => trees);
    },
    [onExpandItemProp]
  );

  const onDrop = useCallback(
    (items, target) => {
      onDropProp?.(items, target);
      setTrees(trees => trees);
    },
    [onDropProp]
  );

  const focusTree = useCallback((treeId: string) => {
    const focusItem = getDocument()?.querySelector(
      `[data-rct-tree="${treeId}"] [data-rct-item-focus="true"]`
    );
    (focusItem as HTMLElement)?.focus?.();
  }, []);

  const setActiveTree = useCallback(
    (treeIdOrSetStateFunction, autoFocusTree = true) => {
      const maybeFocusTree = (treeId: string | undefined) => {
        if (
          autoFocusTree &&
          (autoFocus ?? true) &&
          treeId &&
          !getDocument()
            ?.querySelector(`[data-rct-tree="${treeId}"]`)
            ?.contains(document.activeElement)
        ) {
          focusTree(treeId);
        }
      };

      if (typeof treeIdOrSetStateFunction === 'function') {
        setActiveTreeId(oldValue => {
          const treeId = treeIdOrSetStateFunction(oldValue);

          if (treeId !== oldValue) {
            maybeFocusTree(treeId);
          }

          return treeId;
        });
      } else {
        const treeId = treeIdOrSetStateFunction;
        setActiveTreeId(treeId);
        maybeFocusTree(treeId);
      }
    },
    [autoFocus, focusTree]
  );

  const renderers = useRenderers(props);

  return {
    ...renderers,
    ...props,
    onFocusItem: onFocusItemHandler,
    registerTree,
    unregisterTree,
    onExpandItem,
    onCollapseItem,
    onDrop,
    setActiveTree,
    treeIds,
    trees,
    activeTreeId,
    linearItems,
  };
};
