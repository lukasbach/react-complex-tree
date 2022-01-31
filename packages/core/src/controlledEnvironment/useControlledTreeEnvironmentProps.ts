import { ControlledTreeEnvironmentProps, TreeConfiguration, TreeEnvironmentContextProps } from '../types';
import { scrollIntoView } from '../tree/scrollIntoView';
import { useCallback, useMemo, useState } from 'react';
import { useMemoizedObject } from '../useMemoizedObject';
import { useRenderers } from '../renderers/useRenderers';

export const useControlledTreeEnvironmentProps = (
  props: ControlledTreeEnvironmentProps
): TreeEnvironmentContextProps => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [activeTreeId, setActiveTreeId] = useState<string>();

  const memoizedProps = useMemoizedObject(props);
  const { onFocusItem, autoFocus, onRegisterTree, onUnregisterTree } = memoizedProps;

  const onFocusItemHandler = useCallback(
    (item, treeId) => {
      onFocusItem?.(item, treeId);
      const newItem = document.querySelector(`[data-rct-tree="${treeId}"] [data-rct-item-id="${item.index}"]`);

      if (autoFocus ?? true) {
        if (document.activeElement?.attributes.getNamedItem('data-rct-search-input')?.value !== 'true') {
          // Move DOM focus to item if the current focus is not on the search input
          (newItem as HTMLElement)?.focus?.();
        } else {
          // Otherwise just manually scroll into view
          scrollIntoView(newItem);
        }
      }
    },
    [autoFocus, onFocusItem]
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

  const setActiveTree = useCallback(
    (treeIdOrSetStateFunction, autoFocusTree = true) => {
      const focusTree = (treeId: string | undefined) => {
        if (
          autoFocusTree &&
          (autoFocus ?? true) &&
          treeId &&
          !document.querySelector(`[data-rct-tree="${treeId}"]`)?.contains(document.activeElement)
        ) {
          const focusItem = document.querySelector(`[data-rct-tree="${treeId}"] [data-rct-item-focus="true"]`);
          (focusItem as HTMLElement)?.focus?.();
        }
      };

      if (typeof treeIdOrSetStateFunction === 'function') {
        setActiveTreeId(oldValue => {
          const treeId = treeIdOrSetStateFunction(oldValue);

          if (treeId !== oldValue) {
            focusTree(treeId);
          }

          return treeId;
        });
      } else {
        const treeId = treeIdOrSetStateFunction;
        setActiveTreeId(treeId);
        focusTree(treeId);
      }
    },
    [autoFocus]
  );

  const treeIds = useMemo(() => Object.keys(trees), [trees]);
  const renderers = useRenderers(memoizedProps);

  return {
    ...renderers,
    ...memoizedProps,
    onFocusItem: onFocusItemHandler,
    registerTree,
    unregisterTree,
    setActiveTree,
    treeIds,
    trees,
    activeTreeId,
  };
};
