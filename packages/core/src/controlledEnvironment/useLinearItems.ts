import { useTreeEnvironment } from './ControlledTreeEnvironment';

export const useLinearItems = (treeId: string) =>
  useTreeEnvironment().linearItems[treeId];
