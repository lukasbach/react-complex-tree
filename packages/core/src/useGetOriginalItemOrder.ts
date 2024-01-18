import { useTreeEnvironment } from './controlledEnvironment/ControlledTreeEnvironment';
import { TreeItem } from './types';
import { useStableHandler } from './useStableHandler';

export const useGetOriginalItemOrder = () => {
  const env = useTreeEnvironment();
  return useStableHandler((treeId: string, items: TreeItem[]) =>
    items
      .map(
        item =>
          [
            item,
            env.linearItems[treeId].findIndex(
              linearItem => linearItem.item === item.index
            ),
          ] as const
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .sort(([_, aPos], [_2, bPos]) => aPos - bPos)
      .map(([item]) => item)
  );
};
