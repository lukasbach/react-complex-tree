import { DraggingPosition, TreeItem } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';

export const useCanDropAt = (draggingItems: TreeItem[] | undefined) => {
  const environment = useTreeEnvironment();

  return (draggingPosition: DraggingPosition) => {
    if (!environment.allowReorderingItems && draggingPosition.targetType === 'between-items') {
      return false;
    }

    // TODO test for allowDropOnItemWithChildren

    if (environment.canDropAt && (!draggingItems
      || !environment.canDropAt(draggingItems, draggingPosition))) {
      // setDraggingPosition(undefined);
      return false;
    }

    return true;
  };
}