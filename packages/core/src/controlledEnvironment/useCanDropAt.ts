import { useCallback } from 'react';
import { DraggingPosition, TreeItem } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';

export const useCanDropAt = () => {
  const environment = useTreeEnvironment();

  return useCallback(
    (draggingPosition: DraggingPosition, draggingItems: TreeItem[]) => {
      if (draggingPosition.targetType === 'between-items') {
        if (!environment.canReorderItems) {
          return false;
        }
      } else {
        const resolvedItem = environment.items[draggingPosition.targetItem];
        if (
          (!environment.canDropOnFolder && resolvedItem.isFolder) ||
          (!environment.canDropOnItemWithoutChildren && !resolvedItem.isFolder)
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
