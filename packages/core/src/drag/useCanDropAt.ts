import { useCallback } from 'react';
import { DraggingPosition, TreeItem } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export const useCanDropAt = () => {
  const environment = useTreeEnvironment();

  return useCallback(
    (draggingPosition: DraggingPosition, draggingItems: TreeItem[]) => {
      if (draggingPosition.targetType === 'between-items') {
        if (!environment.canReorderItems) {
          return false;
        }
      } else if (draggingPosition.targetType === 'root') {
        if (!environment.canDropOnFolder) {
          return false;
        }
      } else {
        const resolvedItem = environment.items[draggingPosition.targetItem];
        if (
          !resolvedItem ||
          (!environment.canDropOnFolder && resolvedItem.isFolder) ||
          (!environment.canDropOnNonFolder && !resolvedItem.isFolder) ||
          draggingItems.some(
            draggingItem => draggingItem.index === draggingPosition.targetItem
          )
        ) {
          return false;
        }
      }

      if (
        environment.canDropAt &&
        (!draggingItems ||
          !environment.canDropAt(draggingItems, draggingPosition))
      ) {
        // setDraggingPosition(undefined);
        return false;
      }

      return true;
    },
    [environment]
  );
};
