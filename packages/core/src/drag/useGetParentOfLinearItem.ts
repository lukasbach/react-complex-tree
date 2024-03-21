import { useCallback } from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export const useGetGetParentOfLinearItem = () => {
  const environment = useTreeEnvironment();

  return useCallback(
    (itemLinearIndex: number, treeId: string) => {
      const linearItems = environment.linearItems[treeId];
      const { depth } = linearItems[itemLinearIndex];
      let parentLinearIndex = itemLinearIndex;
      for (
        ;
        !!linearItems[parentLinearIndex] &&
        linearItems[parentLinearIndex].depth !== depth - 1;
        parentLinearIndex -= 1
      );
      let parent = linearItems[parentLinearIndex];

      if (!parent) {
        parent = { item: environment.trees[treeId].rootItem, depth: 0 };
        parentLinearIndex = 0;
      }

      return { parent, parentLinearIndex };
    },
    [environment.linearItems, environment.trees]
  );
};
