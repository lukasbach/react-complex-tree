import { useCallback } from 'react';
import { DraggingPosition, TreeItem } from '../types';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useCanDropAt } from './useCanDropAt';

export const useGetViableDragPositions = () => {
  const environment = useTreeEnvironment();
  const getParentOfLinearItem = useGetGetParentOfLinearItem();
  const canDropAt = useCanDropAt();

  return useCallback(
    (treeId: string, draggingItems: TreeItem[]) => {
      const linearItems = environment.linearItems[treeId];
      return linearItems
        .map<DraggingPosition[]>(({ item, depth }, linearIndex) => {
          const { parent } = getParentOfLinearItem(linearIndex, treeId);
          const childIndex =
            environment.items[parent.item].children!.indexOf(item);

          const itemPosition: DraggingPosition = {
            targetType: 'item',
            parentItem: parent.item,
            targetItem: item,
            linearIndex,
            depth,
            treeId,
          };

          const topPosition: DraggingPosition = {
            targetType: 'between-items',
            parentItem: parent.item,
            linePosition: 'top',
            childIndex,
            depth,
            treeId,
            linearIndex,
          };

          const bottomPosition: DraggingPosition = {
            targetType: 'between-items',
            parentItem: parent.item,
            linePosition: 'bottom',
            linearIndex: linearIndex + 1,
            childIndex: childIndex + 1,
            depth,
            treeId,
          };

          const skipTopPosition =
            depth === (linearItems[linearIndex - 1]?.depth ?? -1);

          if (skipTopPosition) {
            return [itemPosition, bottomPosition];
          }
          return [topPosition, itemPosition, bottomPosition];
        })
        .reduce((a, b) => [...a, ...b], [])
        .filter(position => canDropAt(position, draggingItems));
    },
    [
      canDropAt,
      environment.items,
      environment.linearItems,
      getParentOfLinearItem,
    ]
  );
};
