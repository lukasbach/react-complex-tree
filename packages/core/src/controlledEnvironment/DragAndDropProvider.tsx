import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DragAndDropContextProps, DraggingPosition, TreeItem, TreeItemIndex } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useOnDragOverTreeHandler } from './useOnDragOverTreeHandler';
import { useCanDropAt } from './useCanDropAt';
import { useGetViableDragPositions } from './useGetViableDragPositions';
import { useSideEffect } from '../useSideEffect';

const DragAndDropContext = React.createContext<DragAndDropContextProps>(null as any);
export const useDragAndDrop = () => React.useContext(DragAndDropContext);

const buildMapForTrees = <T extends any>(treeIds: string[], build: (treeId: string) => T): { [treeId: string]: T } => {
  return treeIds.map(id => [id, build(id)] as const).reduce((a, [id, obj]) => ({ ...a, [id]: obj }), {});
};

// TODO tidy up
export const DragAndDropProvider: React.FC = props => {
  const environment = useTreeEnvironment();
  const [isProgrammaticallyDragging, setIsProgrammaticallyDragging] = useState(false);
  const [itemHeight, setItemHeight] = useState(4);
  const [linearItems, setLinearItems] = useState<{ [treeId: string]: ReturnType<typeof getItemsLinearly> }>({});
  const [viableDragPositions, setViableDragPositions] = useState<{ [treeId: string]: DraggingPosition[] }>({});
  const [programmaticDragIndex, setProgrammaticDragIndex] = useState(0);
  const [draggingItems, setDraggingItems] = useState<TreeItem[]>();
  const [draggingPosition, setDraggingPosition] = useState<DraggingPosition>();
  const [dragCode, setDragCode] = useState('_nodrag');
  const getViableDragPositions = useGetViableDragPositions();

  const resetProgrammaticDragIndexForCurrentTree = useCallback(
    (
      viableDragPositions: DraggingPosition[],
      linearItems: ReturnType<typeof getItemsLinearly>,
      draggingItems: TreeItem[] | undefined
    ) => {
      if (
        environment.activeTreeId &&
        environment.viewState[environment.activeTreeId]?.focusedItem &&
        linearItems &&
        draggingItems
      ) {
        const focusItem = environment.viewState[environment.activeTreeId]!.focusedItem;
        const treeDragPositions = getViableDragPositions(environment.activeTreeId, draggingItems, linearItems);
        const newPos = treeDragPositions.findIndex(pos => {
          if (pos.targetType === 'item') {
            return pos.targetItem === focusItem;
          } else if (pos.targetType === 'between-items') {
            return environment.items[pos.parentItem].children![pos.childIndex] === focusItem;
          }
        });

        if (newPos) {
          setProgrammaticDragIndex(Math.min(newPos + 1, treeDragPositions.length - 1));
        } else {
          setProgrammaticDragIndex(0);
        }
      } else {
        setProgrammaticDragIndex(0);
      }
    },
    [environment.activeTreeId, environment.items, environment.viewState, getViableDragPositions]
  );

  const resetState = useCallback(() => {
    setIsProgrammaticallyDragging(false);
    setItemHeight(4);
    setLinearItems({});
    setViableDragPositions({});
    setProgrammaticDragIndex(0);
    setDraggingItems(undefined);
    setDraggingPosition(undefined);
    setDragCode('_nodrag');
  }, []);

  useSideEffect(
    () => {
      if (
        environment.activeTreeId &&
        linearItems[environment.activeTreeId] &&
        viableDragPositions[environment.activeTreeId]
      ) {
        resetProgrammaticDragIndexForCurrentTree(
          viableDragPositions[environment.activeTreeId],
          linearItems[environment.activeTreeId],
          draggingItems
        );
      }
    },
    [
      draggingItems,
      environment.activeTreeId,
      linearItems,
      resetProgrammaticDragIndexForCurrentTree,
      viableDragPositions,
    ],
    [environment.activeTreeId]
  );

  useSideEffect(
    () => {
      if (isProgrammaticallyDragging && environment.activeTreeId) {
        setDraggingPosition(viableDragPositions[environment.activeTreeId][programmaticDragIndex]);
      }
    },
    [programmaticDragIndex, environment.activeTreeId, isProgrammaticallyDragging, viableDragPositions],
    [programmaticDragIndex, environment.activeTreeId]
  );

  const canDropAt = useCanDropAt();

  const performDrag = (draggingPosition: DraggingPosition) => {
    if (draggingItems && !canDropAt(draggingPosition, draggingItems)) {
      return;
    }

    setDraggingPosition(draggingPosition);
    environment.setActiveTree(draggingPosition.treeId);

    if (draggingItems && environment.activeTreeId !== draggingPosition.treeId) {
      // TODO maybe do only if draggingItems are different to selectedItems
      environment.onSelectItems?.(
        draggingItems.map(item => item.index),
        draggingPosition.treeId
      );
    }
  };

  const onDragOverTreeHandler = useOnDragOverTreeHandler(
    dragCode,
    setDragCode,
    itemHeight,
    linearItems,
    setDraggingPosition,
    performDrag
  );

  const onDropHandler = useMemo(
    () => () => {
      if (draggingItems && draggingPosition && environment.onDrop) {
        environment.onDrop(draggingItems, draggingPosition);

        requestAnimationFrame(() => {
          environment.onFocusItem?.(draggingItems[0], draggingPosition.treeId);
          resetState();
        });
      }
    },
    [draggingItems, draggingPosition, environment, resetState]
  );

  const onStartDraggingItems = useCallback(
    (items, treeId) => {
      const treeLinearItems = buildMapForTrees(environment.treeIds, treeId =>
        getItemsLinearly(environment.trees[treeId].rootItem, environment.viewState[treeId] ?? {}, environment.items)
      );
      const treeViableDragPositions = buildMapForTrees(environment.treeIds, treeId =>
        getViableDragPositions(treeId, items, treeLinearItems[treeId])
      );

      // TODO what if trees have different heights and drag target changes?
      const height =
        document.querySelector<HTMLElement>(`[data-rct-tree="${treeId}"] [data-rct-item-container="true"]`)
          ?.offsetHeight ?? 5;
      setItemHeight(height);
      setDraggingItems(items);
      setLinearItems(treeLinearItems);
      setViableDragPositions(treeViableDragPositions);

      if (environment.activeTreeId) {
        resetProgrammaticDragIndexForCurrentTree(
          treeViableDragPositions[environment.activeTreeId],
          treeLinearItems[environment.activeTreeId],
          items
        );
      }
    },
    [
      environment.activeTreeId,
      environment.items,
      environment.treeIds,
      environment.trees,
      environment.viewState,
      getViableDragPositions,
      resetProgrammaticDragIndexForCurrentTree,
    ]
  );

  const startProgrammaticDrag = useCallback(() => {
    if (!environment.canDragAndDrop) {
      return;
    }

    if (environment.activeTreeId) {
      const draggingItems =
        environment.viewState[environment.activeTreeId]?.selectedItems ??
        ([environment.viewState[environment.activeTreeId]?.focusedItem] as TreeItemIndex[]);

      if (draggingItems.length === 0 || draggingItems[0] === undefined) {
        return;
      }

      const resolvedDraggingItems = draggingItems.map(id => environment.items[id]);

      if (environment.canDrag && !environment.canDrag(resolvedDraggingItems)) {
        return;
      }

      onStartDraggingItems(resolvedDraggingItems, environment.activeTreeId);
      setTimeout(() => {
        setIsProgrammaticallyDragging(true);
        // Needs to be done after onStartDraggingItems was called, so that viableDragPositions is populated
      });
    }
  }, [onStartDraggingItems, environment]);

  const abortProgrammaticDrag = useCallback(() => {
    resetState();
  }, [resetState]);

  const completeProgrammaticDrag = useCallback(() => {
    onDropHandler();
    resetState();
  }, [onDropHandler, resetState]);

  const programmaticDragUp = useCallback(() => {
    setProgrammaticDragIndex(oldIndex => Math.max(0, oldIndex - 1));
  }, []);

  const programmaticDragDown = useCallback(() => {
    if (environment.activeTreeId) {
      setProgrammaticDragIndex(oldIndex =>
        Math.min(viableDragPositions[environment.activeTreeId!].length, oldIndex + 1)
      );
    }
  }, [environment.activeTreeId, viableDragPositions]);

  const dnd: DragAndDropContextProps = {
    onStartDraggingItems,
    startProgrammaticDrag,
    abortProgrammaticDrag,
    completeProgrammaticDrag,
    programmaticDragUp,
    programmaticDragDown,
    draggingItems,
    draggingPosition,
    itemHeight,
    isProgrammaticallyDragging,
    onDragOverTreeHandler,
    viableDragPositions,
  };

  useEffect(() => {
    window.addEventListener('dragend', onDropHandler);
    window.addEventListener('touchend', onDropHandler);
    return () => {
      window.removeEventListener('dragend', onDropHandler);
      window.removeEventListener('touchend', onDropHandler);
    };
  }, [onDropHandler]);

  return <DragAndDropContext.Provider value={dnd}>{props.children}</DragAndDropContext.Provider>;
};
