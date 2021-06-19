import { useContext } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeConfigurationContext } from './Tree';

export const useViewState = () => {
  const { treeId } = useContext(TreeConfigurationContext);
  const environment = useContext(TreeEnvironmentContext);
  return environment.viewState[treeId] ?? {};
};
