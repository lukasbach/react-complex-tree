import { getItemsLinearly } from '../tree/getItemsLinearly';
import { useTreeEnvironment } from './ControlledTreeEnvironment';

export const useGetGetParentOfLinearItem = () => {
  const environment = useTreeEnvironment();

  return (linearItems: ReturnType<typeof getItemsLinearly>, itemLinearIndex: number, treeId: string) => {
    const depth = linearItems[itemLinearIndex].depth;
    let parentLinearIndex = itemLinearIndex;
    for (; !!linearItems[parentLinearIndex] && linearItems[parentLinearIndex].depth !== depth - 1; parentLinearIndex--);
    let parent = linearItems[parentLinearIndex];

    if (!parent) {
      parent = { item: environment.trees[treeId].rootItem, depth: 0 };
      parentLinearIndex = 0;
    }

    return parent;
  };
};
