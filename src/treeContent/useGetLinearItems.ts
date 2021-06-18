import { useContext, useMemo } from 'react';
import { getItemsLinearly } from './getItemsLinearly';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useViewState } from './useViewState';

export const useGetLinearItems = (treeId: string, rootItem: string) => {
  const viewState = useViewState();
  const environment = useContext(TreeEnvironmentContext);
  return () => getItemsLinearly(rootItem, viewState, environment.items);
}