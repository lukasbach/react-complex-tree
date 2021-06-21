import { useMemo } from 'react';
import { TreeConfiguration, TreeEnvironmentContextProps, TreeInformation } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

const createTreeInformation = <T>(environment: TreeEnvironmentContextProps, treeConfiguration: TreeConfiguration, search: string | null): TreeInformation => ({
  isFocused: environment.activeTreeId === treeConfiguration.treeId,
  isRenaming: environment.viewState[treeConfiguration.treeId]?.renamingItem !== undefined,
  areItemsSelected: (environment.viewState[treeConfiguration.treeId]?.selectedItems?.length ?? 0) > 0,
  isSearching: search !== null,
  search: search,
  ...treeConfiguration
});

const createTreeInformationDependencies = <T>(environment: TreeEnvironmentContextProps, treeId: string, search: string | null) => [
  environment.activeTreeId,
  environment.viewState[treeId]?.renamingItem,
  environment.viewState[treeId]?.selectedItems,
  treeId,
  search,
];

export const useCreatedTreeInformation = (treeConfiguration: TreeConfiguration, search: string | null) => {
  const environment = useTreeEnvironment();
  return useMemo(
    () => createTreeInformation(environment, treeConfiguration, search),
    createTreeInformationDependencies(environment, treeConfiguration.treeId, search),
  );
};
