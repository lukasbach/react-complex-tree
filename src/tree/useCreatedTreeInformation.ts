import { useMemo } from 'react';
import { TreeEnvironmentContextProps, TreeInformation } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

const createTreeInformation = <T>(environment: TreeEnvironmentContextProps, treeId: string, search: string | null): TreeInformation => ({
  isFocused: environment.activeTreeId === treeId,
  isRenaming: environment.viewState[treeId]?.renamingItem !== undefined,
  areItemsSelected: (environment.viewState[treeId]?.selectedItems?.length ?? 0) > 0,
  isSearching: search !== null,
  search: search,
});

const createTreeInformationDependencies = <T>(environment: TreeEnvironmentContextProps, treeId: string, search: string | null) => [
  environment.activeTreeId,
  environment.viewState[treeId]?.renamingItem,
  environment.viewState[treeId]?.selectedItems,
  treeId,
  search,
];

export const useCreatedTreeInformation = (treeId: string, search: string | null) => {
  const environment = useTreeEnvironment();
  return useMemo(
    () => createTreeInformation(environment, treeId, search),
    createTreeInformationDependencies(environment, treeId, search),
  );
}