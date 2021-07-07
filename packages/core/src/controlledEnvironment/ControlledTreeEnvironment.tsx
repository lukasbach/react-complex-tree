import * as React from 'react';
import { useContext, useState } from 'react';
import {
  ControlledTreeEnvironmentProps,
  TreeConfiguration,
  TreeEnvironmentContextProps,
  TreeEnvironmentRef,
} from '../types';
import { createDefaultRenderers } from '../renderers/createDefaultRenderers';
import { scrollIntoView } from '../tree/scrollIntoView';
import { InteractionManagerProvider } from './InteractionManagerProvider';
import { DragAndDropProvider } from './DragAndDropProvider';
import { EnvironmentActionsProvider } from '../environmentActions/EnvironmentActionsProvider';

const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(null as any);
export const useTreeEnvironment = () => useContext(TreeEnvironmentContext);

export const ControlledTreeEnvironment = React.forwardRef<TreeEnvironmentRef, ControlledTreeEnvironmentProps>(
  (props, ref) => {
    const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
    const [activeTreeId, setActiveTreeId] = useState<string>();

    const viewState = props.viewState;

    // Make sure that every tree view state has a focused item
    for (const treeId of Object.keys(trees)) {
      // TODO if the focus item is dragged out of the tree and is not within the expanded items
      // TODO of that tree, the tree does not show any focus item anymore.
      // Fix: use linear items to see if focus item is visible, and reset if not. Only refresh that
      // information when the viewstate changes
      if (!viewState[treeId]?.focusedItem && trees[treeId]) {
        viewState[treeId] = {
          ...viewState[treeId],
          focusedItem: props.items[trees[treeId].rootItem]?.children?.[0],
        };
      }
    }

    const environmentContextProps: TreeEnvironmentContextProps = {
      ...createDefaultRenderers(props),
      ...props,
      onFocusItem: (item, treeId) => {
        props.onFocusItem?.(item, treeId);
        const newItem = document.querySelector(`[data-rct-tree="${treeId}"] [data-rct-item-id="${item.index}"]`);

        if (props.autoFocus ?? true) {
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
        setTrees(trees => ({ ...trees, [tree.treeId]: tree }));
        props.onRegisterTree?.(tree);
      },
      unregisterTree: treeId => {
        props.onUnregisterTree?.(trees[treeId]);
        delete trees[treeId];
        setTrees(trees);
      },
      setActiveTree: (treeIdOrSetStateFunction, autoFocus = true) => {
        const focusTree = (treeId: string | undefined) => {
          if (
            autoFocus &&
            (props.autoFocus ?? true) &&
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
      treeIds: Object.keys(trees),
      trees,
      activeTreeId,
    };

    return (
      <TreeEnvironmentContext.Provider value={environmentContextProps}>
        <InteractionManagerProvider>
          <DragAndDropProvider>
            <EnvironmentActionsProvider ref={ref}>{props.children}</EnvironmentActionsProvider>
          </DragAndDropProvider>
        </InteractionManagerProvider>
      </TreeEnvironmentContext.Provider>
    );
  }
) as <T = any>(p: ControlledTreeEnvironmentProps<T> & { ref?: React.Ref<TreeEnvironmentRef<T>> }) => React.ReactElement;
