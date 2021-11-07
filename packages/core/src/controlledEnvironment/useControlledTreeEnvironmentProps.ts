import { ControlledTreeEnvironmentProps, TreeConfiguration, TreeEnvironmentContextProps } from '../types';
import { createDefaultRenderers } from '../renderers';
import { scrollIntoView } from '../tree/scrollIntoView';
import { useMemo, useState } from 'react';
import { useMemoizedObject } from '../useMemoizedObject';

export const useControlledTreeEnvironmentProps = (props: ControlledTreeEnvironmentProps) => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [activeTreeId, setActiveTreeId] = useState<string>();

  const memoizedProps = useMemoizedObject(props);

  return useMemo<TreeEnvironmentContextProps>(() => ({
    ...createDefaultRenderers(memoizedProps),
    ...memoizedProps,
    onFocusItem: (item, treeId) => {
      memoizedProps.onFocusItem?.(item, treeId);
      const newItem = document.querySelector(`[data-rct-tree="${ treeId }"] [data-rct-item-id="${ item.index }"]`);

      if (memoizedProps.autoFocus ?? true) {
        if (document.activeElement?.attributes.getNamedItem('data-rct-search-input')?.value !== 'true') {
          // Move DOM focus to item if the current focus is not on the search input
          (newItem as HTMLElement)?.focus?.();
        } else {
          // Otherwise just manually scroll into view
          scrollIntoView(newItem);
        }
      }
    },
    registerTree: tree => {
      setTrees(trees => ({...trees, [tree.treeId]: tree}));
      memoizedProps.onRegisterTree?.(tree);
    },
    unregisterTree: treeId => {
      memoizedProps.onUnregisterTree?.(trees[treeId]);
      delete trees[treeId];
      setTrees(trees);
    },
    setActiveTree: (treeIdOrSetStateFunction, autoFocus = true) => {
      const focusTree = (treeId: string | undefined) => {
        if (
          autoFocus &&
          (memoizedProps.autoFocus ?? true) &&
          treeId &&
          !document.querySelector(`[data-rct-tree="${ treeId }"]`)?.contains(document.activeElement)
        ) {
          const focusItem = document.querySelector(`[data-rct-tree="${ treeId }"] [data-rct-item-focus="true"]`);
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
    treeIds: Object.keys(trees),
    trees,
    activeTreeId,
  }), [memoizedProps, activeTreeId, trees]);
};
