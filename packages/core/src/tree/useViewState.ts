import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export const useViewState = () => {
  const { treeId } = useTree();
  const { viewState } = useTreeEnvironment();
  return viewState[treeId] ?? {};
};
