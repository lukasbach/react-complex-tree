import { useContext } from 'react';
import { TreeIdContext } from './Tree';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';

export const useViewState = () => {
  const treeId = useContext(TreeIdContext);
  const environment = useContext(TreeEnvironmentContext);
  return environment.viewState[treeId] ?? {};
}