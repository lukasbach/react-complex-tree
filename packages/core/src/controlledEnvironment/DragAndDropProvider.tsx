import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { DragAndDropContextProps, DraggingPosition, TreeItem, TreeItemIndex } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { useOnDragOverTreeHandler } from './useOnDragOverTreeHandler';
import { useCanDropAt } from './useCanDropAt';
import { useGetViableDragPositions } from './useGetViableDragPositions';
import { useSideEffect } from '../useSideEffect';
import { buildMapForTrees } from '../utils';
import { useCallSoon } from '../useCallSoon';

const DragAndDropContext = React.createContext<DragAndDropContextProps>(null as any);
export const useDragAndDrop = () => React.useContext(DragAndDropContext);

// TODO tidy up
export const DragAndDropProvider: React.FC = props => {
  const environment = useTreeEnvironment();
  const [isProgrammaticallyDragging, setIsProgrammaticallyDragging] = useState(false);
  const [itemHeight, setItemHeight] = useState(4);
  const [viableDragPositions, setViableDragPositions] = useState<{ [treeId: string]: DraggingPosition[] }>({});
  const [programmaticDragIndex, setProgrammaticDragIndex] = useState(0);
  const [draggingItems, setDraggingItems] = useState<TreeItem[]>();
  const [draggingPosition, setDraggingPosition] = useState<DraggingPosition>();
  const [dragCode, setDragCode] = useState('_nodrag');
  const getViableDragPositions = useGetViableDragPositions();
  const callSoon = useCallSoon();

  const resetProgrammaticDragIndexForCurrentTree = useCallback(
    (viableDragPositions: DraggingPosition[], draggingItems: TreeItem[] | undefined) => {
      if (
        environment.activeTreeId &&
        environment.viewState[environment.activeTreeId]?.focusedItem &&
        environment.linearItems &&
        draggingItems
      ) {
        const focusItem = environment.viewState[environment.activeTreeId]!.focusedItem;
        const treeDragPositions = getViableDragPositions(environment.activeTreeId, draggingItems);
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
    [
      environment.activeTreeId,
      environment.items,
      environment.linearItems,
      environment.viewState,
      getViableDragPositions,
    ]
  );

  const resetState = useCallback(() => {
    setIsProgrammaticallyDragging(false);
    setItemHeight(4);
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
        environment.linearItems[environment.activeTreeId] &&
        viableDragPositions[environment.activeTreeId]
      ) {
        resetProgrammaticDragIndexForCurrentTree(viableDragPositions[environment.activeTreeId], draggingItems);
      }
    },
    [
      draggingItems,
      environment.activeTreeId,
      environment.linearItems,
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
    setDraggingPosition,
    performDrag
  );

  const onDropHandler = useCallback(() => {
    if (draggingItems && draggingPosition && environment.onDrop) {
      environment.onDrop(draggingItems, draggingPosition);

      callSoon(() => {
        environment.onFocusItem?.(draggingItems[0], draggingPosition.treeId);
        resetState();
      });
    }
  }, [draggingItems, draggingPosition, environment, resetState, callSoon]);

  const onStartDraggingItems = useCallback(
    (items, treeId) => {
      const treeViableDragPositions = buildMapForTrees(environment.treeIds, treeId =>
        getViableDragPositions(treeId, items)
      );

      // TODO what if trees have different heights and drag target changes?
      const height =
        document.querySelector<HTMLElement>(`[data-rct-tree="${treeId}"] [data-rct-item-container="true"]`)
          ?.offsetHeight ?? 5;
      setItemHeight(height);
      setDraggingItems(items);
      setViableDragPositions(treeViableDragPositions);

      if (environment.activeTreeId) {
        resetProgrammaticDragIndexForCurrentTree(treeViableDragPositions[environment.activeTreeId], items);
      }
    },
    [environment.activeTreeId, environment.treeIds, getViableDragPositions, resetProgrammaticDragIndexForCurrentTree]
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
    window.addEventListener('dragend', resetState);
    window.addEventListener('drop', onDropHandler);
    return () => {
      window.removeEventListener('dragend', resetState);
      window.removeEventListener('drop', onDropHandler);
    };
  }, [onDropHandler, resetState]);

  return <DragAndDropContext.Provider value={dnd}>{props.children}</DragAndDropContext.Provider>;
};
