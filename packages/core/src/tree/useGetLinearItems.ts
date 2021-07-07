import { getItemsLinearly } from './getItemsLinearly';
import { useViewState } from './useViewState';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useTree } from './Tree';

export const useGetLinearItems = () => {
  const { rootItem } = useTree();
  const viewState = useViewState();
  const environment = useTreeEnvironment();
  return () => getItemsLinearly(rootItem, viewState, environment.items);
};
