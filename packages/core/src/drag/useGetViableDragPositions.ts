/* eslint-disable no-continue */
import { useCallback } from 'react';
import { DraggingPosition, TreeItem } from '../types';
import { useGetGetParentOfLinearItem } from './useGetParentOfLinearItem';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useCanDropAt } from './useCanDropAt';

export const useGetViableDragPositions = () => {
  const environment = useTreeEnvironment();
  const getParentOfLinearItem = useGetGetParentOfLinearItem();
  const canDropAt = useCanDropAt();

  const isDescendant = useCallback(
    (treeId: string, itemLinearIndex: number, potentialParents: TreeItem[]) => {
      // based on DraggingPositionEvaluation.isDescendant()
      const { parent, parentLinearIndex } = getParentOfLinearItem(
        itemLinearIndex,
        treeId
      );
      if (potentialParents.some(p => p.index === parent.item)) return true;
      if (parent.depth === 0) return false;
      return isDescendant(treeId, parentLinearIndex, potentialParents);
    },
    [getParentOfLinearItem]
  );

  return useCallback(
    (treeId: string, draggingItems: TreeItem[]) => {
      const linearItems = environment.linearItems[treeId];
      const targets: DraggingPosition[] = [];
      let skipUntilDepthIsLowerThan = -1;

      for (
        let linearIndex = 0;
        linearIndex < linearItems.length;
        // eslint-disable-next-line no-plusplus
        linearIndex++
      ) {
        const { item, depth } = linearItems[linearIndex];

        if (
          skipUntilDepthIsLowerThan !== -1 &&
          depth > skipUntilDepthIsLowerThan
        ) {
          continue;
        } else {
          skipUntilDepthIsLowerThan = -1;
        }

        const { parent } = getParentOfLinearItem(linearIndex, treeId);
        const childIndex =
          environment.items[parent.item].children!.indexOf(item);

        if (isDescendant(treeId, linearIndex, draggingItems)) {
          skipUntilDepthIsLowerThan = depth + 1;
          continue;
        }

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

        const depthOfItemAbove = linearItems[linearIndex - 1]?.depth ?? -1;
        const depthOfItemBelow = linearItems[linearIndex + 1]?.depth ?? -1;
        const isWithinFolder = depth === depthOfItemAbove;
        const isBelowOpenFolder = depth === depthOfItemBelow - 1;

        if (!isWithinFolder && canDropAt(topPosition, draggingItems)) {
          targets.push(topPosition);
        }
        if (canDropAt(itemPosition, draggingItems)) {
          targets.push(itemPosition);
        }
        if (!isBelowOpenFolder && canDropAt(bottomPosition, draggingItems)) {
          targets.push(bottomPosition);
        }
      }

      return targets;
    },
    [
      canDropAt,
      environment.items,
      environment.linearItems,
      getParentOfLinearItem,
      isDescendant,
    ]
  );
};
