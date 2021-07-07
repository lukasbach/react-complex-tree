import { DraggingPosition, TreeItem } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';

export const useCanDropAt = () => {
  const environment = useTreeEnvironment();

  return (draggingPosition: DraggingPosition, draggingItems: TreeItem[]) => {
    if (draggingPosition.targetType === 'between-items') {
      if (!environment.canReorderItems) {
        return false;
      }
    } else {
      const resolvedItem = environment.items[draggingPosition.targetItem];
      if (
        (!environment.canDropOnItemWithChildren && resolvedItem.hasChildren) ||
        (!environment.canDropOnItemWithoutChildren && !resolvedItem.hasChildren)
      ) {
        return false;
      }
    }

    if (environment.canDropAt && (!draggingItems || !environment.canDropAt(draggingItems, draggingPosition))) {
      // setDraggingPosition(undefined);
      return false;
    }

    return true;
  };
};
