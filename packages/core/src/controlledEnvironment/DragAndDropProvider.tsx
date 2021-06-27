import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { DragAndDropContextProps, DraggingPosition, TreeCapabilities, TreeItem, TreeItemIndex } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';
import { useOnDragOverTreeHandler } from './useOnDragOverTreeHandler';
import { useCanDropAt } from './useCanDropAt';
import { useGetViableDragPositions } from './useGetViableDragPositions';

const DragAndDropContext = React.createContext<DragAndDropContextProps>(null as any);
export const useDragAndDrop = () => React.useContext(DragAndDropContext);


const buildMapForTrees = <T extends any>(treeIds: string[], build: ((treeId: string) => T)): { [treeId: string]: T } => {
  return treeIds.map(id => [id, build(id)] as const).reduce((a, [id, obj]) => ({...a, [id]: obj}), {});
};

export const DragAndDropProvider: React.FC = props => {
  const environment = useTreeEnvironment();
  const [isProgrammaticallyDragging, setIsProgrammaticallyDragging] = useState(false);
  const [itemHeight, setItemHeight] = useState(4);
  const [linearItems, setLinearItems] = useState<{ [treeId: string]: ReturnType<typeof getItemsLinearly> }>({});
  const [viableDragPositions, setViableDragPositions] = useState<{ [treeId: string]: DraggingPosition[] }>({});
  const [draggingItems, setDraggingItems] = useState<TreeItem[]>();
  const [draggingPosition, setDraggingPosition] = useState<DraggingPosition>();
  const [dragCode, setDragCode] = useState('_nodrag');

  const canDropAt = useCanDropAt(draggingItems);

  const performDrag = (draggingPosition: DraggingPosition) => {
    if (!canDropAt(draggingPosition)) {
      return;
    }

    setDraggingPosition(draggingPosition);
    environment.setActiveTree(draggingPosition.treeId);

    if (draggingItems && environment.activeTreeId !== draggingPosition.treeId) {
      // TODO maybe do only if draggingItems are different to selectedItems
      environment.onSelectItems?.(draggingItems.map(item => item.index), draggingPosition.treeId);
    }
  };

  const onDragOverTreeHandler = useOnDragOverTreeHandler(dragCode, setDragCode, itemHeight, linearItems, setDraggingPosition, performDrag);
  const getViableDragPositions = useGetViableDragPositions(draggingItems);

  const onDropHandler = useMemo(() => () => {
    setDraggingPosition(undefined);
    setDraggingItems(undefined);

    if (draggingItems && draggingPosition && environment.onDrop) {
      environment.onDrop(draggingItems, draggingPosition);

      requestAnimationFrame(() => {
        environment.onFocusItem?.(draggingItems[0], draggingPosition.treeId);
      })
    }
  }, [draggingPosition, draggingItems, environment.onDrop, environment.onFocusItem]);

  useEffect(() => {
    window.addEventListener('dragend', onDropHandler);
    return () => window.removeEventListener('dragend', onDropHandler);
  }, [onDropHandler]);

  const dnd: DragAndDropContextProps = {
    onStartDraggingItems: (items, treeId) => {
      const treeLinearItems = buildMapForTrees(environment.treeIds, treeId => getItemsLinearly(
        environment.trees[treeId].rootItem, environment.viewState[treeId] ?? {}, environment.items));

      // TODO what if trees have different heights and drag target changes?
      const height = document.querySelector<HTMLElement>(`[data-rct-tree="${treeId}"] [data-rct-item-container="true"]`)?.offsetHeight ?? 5;
      setItemHeight(height);
      setDraggingItems(items);
      setLinearItems(treeLinearItems);
      setViableDragPositions(buildMapForTrees(environment.treeIds, treeId => getViableDragPositions(treeId, treeLinearItems[treeId])));
    },
    startProgrammaticDrag: () => {
      if (environment.activeTreeId) {
        const draggingItems = environment.viewState[environment.activeTreeId]?.selectedItems
          ?? [environment.viewState[environment.activeTreeId]?.focusedItem] as TreeItemIndex[];

        if (draggingItems.length === 0 || draggingItems[0] === undefined) {
          return;
        }

        setIsProgrammaticallyDragging(true);
        dnd.onStartDraggingItems(draggingItems.map(id => environment.items[id]), environment.activeTreeId);
      }
    },
    abortProgrammaticDrag: () => {
      setIsProgrammaticallyDragging(false);
    },
    completeProgrammaticDrag: () => {
      setIsProgrammaticallyDragging(false);
      onDropHandler();
    },
    programmaticDragUp: () => {
    },
    programmaticDragDown: () => {
    },
    draggingItems,
    draggingPosition,
    itemHeight,
    isProgrammaticallyDragging,
    onDragOverTreeHandler,
  };

  return (
    <DragAndDropContext.Provider value={dnd}>
      {props.children}
    </DragAndDropContext.Provider>
  );
};
