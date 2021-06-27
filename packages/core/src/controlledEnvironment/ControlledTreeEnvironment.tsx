import * as React from 'react';
import { useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  ControlledTreeEnvironmentProps,
  DraggingPosition,
  InteractionMode,
  TreeConfiguration,
  TreeEnvironmentContextProps,
  TreeItem,
} from '../types';
import { createDefaultRenderers } from '../renderers/createDefaultRenderers';
import { scrollIntoView } from '../tree/scrollIntoView';
import { InteractionManagerProvider } from './InteractionManagerProvider';
import { DragAndDropManager } from './DragAndDropManager';

const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(null as any);
export const useTreeEnvironment = () => useContext(TreeEnvironmentContext);

export const ControlledTreeEnvironment = React.forwardRef<TreeEnvironmentContextProps, ControlledTreeEnvironmentProps>((props, ref) => {
  const [trees, setTrees] = useState<Record<string, TreeConfiguration>>({});
  const [draggingItems, setDraggingItems] = useState<TreeItem[]>();
  const [draggingPosition, setDraggingPosition] = useState<DraggingPosition>();
  const [itemHeight, setItemHeight] = useState(4);
  const [activeTreeId, setActiveTreeId] = useState<string>();
  const [isProgrammaticallyDragging, setIsProgrammaticallyDragging] = useState(false);
  const dragAndDropManager = useMemo(() => new DragAndDropManager(), []);

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


  const onDropHandler = useMemo(() => () => {
    setDraggingPosition(undefined);
    setDraggingItems(undefined);

    if (draggingItems && draggingPosition && props.onDrop) {
      props.onDrop(draggingItems, draggingPosition);

      requestAnimationFrame(() => {
        onFocusHandler(draggingItems[0], draggingPosition.treeId);
      })
    }
  }, [draggingPosition, draggingItems, props.onDrop]);

  useEffect(() => {
    window.addEventListener('dragend', onDropHandler);
    return () => window.removeEventListener('dragend', onDropHandler);
  }, [onDropHandler]);

  const environmentContextProps: TreeEnvironmentContextProps = {
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
    onDragAtPosition: (position) => {
      setDraggingPosition(position);
    },
    setActiveTree: treeIdOrSetStateFunction => {
      const focusTree = (treeId: string | undefined) => {
        if (treeId && !document.querySelector(`[data-rct-tree="${treeId}"]`)?.contains(document.activeElement)) {
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
    startProgrammaticDrag: () => {
      setIsProgrammaticallyDragging(true);

      // TODO merge height measuring in shared logic component
      // TODO this here assumes all trees have equal item heights
      const height = document.querySelector<HTMLElement>(`[data-rct-item-container="true"]`)?.offsetHeight ?? 5;
      setItemHeight(height);
    },
    abortProgrammaticDrag: () => {
      setIsProgrammaticallyDragging(false);
    },
    completeProgrammaticDrag: () => {
      setIsProgrammaticallyDragging(false);
      onDropHandler();
    },
    treeIds: Object.keys(trees),
    trees,
    draggingPosition,
    activeTreeId,
    draggingItems,
    itemHeight,
    isProgrammaticallyDragging,
    dragAndDropManager,
  };

  useImperativeHandle(ref, () => environmentContextProps);
  dragAndDropManager.useUpdatedEnvironmentProps(environmentContextProps);

  return (
    <TreeEnvironmentContext.Provider value={environmentContextProps}>
      <InteractionManagerProvider>
        {props.children}
      </InteractionManagerProvider>
    </TreeEnvironmentContext.Provider>
  );
}) as <T = any>(p: ControlledTreeEnvironmentProps<T> & { ref?: React.Ref<TreeEnvironmentContextProps> }) => React.ReactElement;
