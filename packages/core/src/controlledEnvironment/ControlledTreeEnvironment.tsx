import * as React from 'react';
import {
  ControlledTreeEnvironmentProps,
  DraggingPosition,
  TreeConfiguration,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';
import { useContext, useEffect, useState } from 'react';
import { createDefaultRenderers } from '../renderers/createDefaultRenderers';
import { scrollIntoView } from '../tree/scrollIntoView';

const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(null as any);
export const useTreeEnvironment = () => useContext(TreeEnvironmentContext);

export const ControlledTreeEnvironment = <T extends any>(props: ControlledTreeEnvironmentProps<T>) => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [draggingItems, setDraggingItems] = useState<TreeItem<T>[]>();
  const [draggingPosition, setDraggingPosition] = useState<DraggingPosition>();
  const [itemHeight, setItemHeight] = useState(4);
  const [activeTree, setActiveTree] = useState<string>();

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
        focusedItem: props.items[trees[treeId].rootItem]?.children?.[0]
      }
    }
  }

  const onFocusHandler: typeof props.onFocusItem = (item, treeId) => {
    props.onFocusItem?.(item, treeId);
    const newItem = document.querySelector(`[data-rct-tree="${treeId}"] [data-rct-item-id="${item.index}"]`);

    if (document.activeElement?.attributes.getNamedItem('data-rct-search-input')?.value !== 'true') {
      // Move DOM focus to item if the current focus is not on the search input
      (newItem as HTMLElement)?.focus?.();
    } else {
      // Otherwise just manually scroll into view
      scrollIntoView(newItem);
    }
  };

  useEffect(() => {
    const dragEndEventListener = () => {
      setDraggingPosition(undefined);
      setDraggingItems(undefined);

      if (draggingItems && draggingPosition && props.onDrop) {
        props.onDrop(draggingItems, draggingPosition);

        requestAnimationFrame(() => {
          onFocusHandler(draggingItems[0], draggingPosition.treeId);
        })
      }
    };

    window.addEventListener('dragend', dragEndEventListener);

    return () => {
      window.removeEventListener('dragend', dragEndEventListener);
    };
  }, [draggingPosition, draggingItems, props.onDrop]);

  return (
    <TreeEnvironmentContext.Provider value={{
      ...createDefaultRenderers(props),
      ...props,
      onFocusItem: onFocusHandler,
      registerTree: (tree) => {
        setTrees(trees => ({...trees, [tree.treeId]: tree}));
        props.onRegisterTree?.(tree);
      },
      unregisterTree: (treeId) => {
        props.onUnregisterTree?.(trees[treeId]);
        delete trees[treeId];
        setTrees(trees);
      },
      onStartDraggingItems: (items, treeId) => {
        setDraggingItems(items);
        const height = document.querySelector<HTMLElement>(`[data-rct-tree="${treeId}"] [data-rct-item-container="true"]`)?.offsetHeight ?? 5;
        setItemHeight(height);
      },
      draggingItems: draggingItems,
      itemHeight: itemHeight,
      onDragAtPosition: (position) => {
        setDraggingPosition(position);
      },
      draggingPosition: draggingPosition,
      activeTreeId: activeTree,
      setActiveTree: treeId => {
        console.log(`Set active tree to ${treeId}`)
        setActiveTree(treeId);

        if (!document.querySelector(`[data-rct-tree="${treeId}"]`)?.contains(document.activeElement)) {
          const focusItem = document.querySelector(`[data-rct-tree="${treeId}"] [data-rct-item-focus="true"]`);
          (focusItem as HTMLElement)?.focus?.();
        }
      },
    }}>
      {props.children}
    </TreeEnvironmentContext.Provider>
  );
};
