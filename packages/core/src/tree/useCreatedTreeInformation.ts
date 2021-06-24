import { useMemo } from 'react';
import { TreeConfiguration, TreeEnvironmentContextProps, TreeInformation, TreeItemIndex } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

const createTreeInformation = <T>(
  environment: TreeEnvironmentContextProps,
  treeConfiguration: TreeConfiguration,
  search: string | null,
  renamingItem?: TreeItemIndex | undefined,
): TreeInformation => ({
  isFocused: environment.activeTreeId === treeConfiguration.treeId,
  isRenaming: !!renamingItem,
  areItemsSelected: (environment.viewState[treeConfiguration.treeId]?.selectedItems?.length ?? 0) > 0,
  isSearching: search !== null,
  search: search,
  ...treeConfiguration
});

const createTreeInformationDependencies = <T>(
  environment: TreeEnvironmentContextProps,
  treeId: string,
  search: string | null,
  renamingItem?: TreeItemIndex | undefined,
) => [
  environment.activeTreeId,
  environment.viewState[treeId]?.selectedItems,
  renamingItem,
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
