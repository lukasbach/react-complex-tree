import { DraggingPosition, TreeItem } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';

export const useCanDropAt = (draggingItems: TreeItem[] | undefined) => {
  const environment = useTreeEnvironment();

  return (draggingPosition: DraggingPosition) => {
    if (!environment.canReorderItems && draggingPosition.targetType === 'between-items') {
      return false;
    }

    // TODO test for canDropOnItemWithChildren

    if (environment.canDropAt && (!draggingItems
      || !environment.canDropAt(draggingItems, draggingPosition))) {
      // setDraggingPosition(undefined);
      return false;
    }

    return true;
  };
}