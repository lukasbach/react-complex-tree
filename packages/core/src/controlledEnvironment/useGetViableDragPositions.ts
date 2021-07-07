import { DraggingPosition, TreeItem } from '../types';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { useCanDropAt } from './useCanDropAt';

export const useGetViableDragPositions = () => {
  const environment = useTreeEnvironment();
  const getParentOfLinearItem = useGetGetParentOfLinearItem();
  const canDropAt = useCanDropAt();

  return (treeId: string, draggingItems: TreeItem[], linearItems: ReturnType<typeof getItemsLinearly>) => {
    return linearItems
      .map<DraggingPosition[]>(({ item, depth }, linearIndex) => {
        const parent = getParentOfLinearItem(linearItems, linearIndex, treeId);
        const childIndex = environment.items[parent.item].children!.indexOf(item);

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

        const skipTopPosition = depth === (linearItems[linearIndex - 1]?.depth ?? -1);

        if (skipTopPosition) {
          return [itemPosition, bottomPosition];
        } else {
          return [topPosition, itemPosition, bottomPosition];
        }
      })
      .reduce((a, b) => [...a, ...b], [])
      .filter(position => canDropAt(position, draggingItems));
  };
};
