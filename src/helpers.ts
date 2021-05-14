import { TreeData, TreeEnvironmentConfiguration, TreeItemIndex, TreeItemPath } from './types';

const isArraysEqual = <T>(arr1: T[], arr2: T[]) => {
  return arr1.length === arr2.length && arr1.reduce((aggr, v1, idx) => aggr && v1 === arr2[idx], true);
};

export const isItemExpanded = (environment: TreeEnvironmentConfiguration, path: TreeItemPath) => {
  return !!environment.expandedItems?.find(item => isArraysEqual(item, path));
}

export const getItemIdFromPath = (path: TreeItemPath) => {
  return path[path.length - 1];
};

export const countVisibleChildrenIncludingSelf = (environment: TreeEnvironmentConfiguration, path: TreeItemPath): number => {
  const item = environment.data.items[getItemIdFromPath(path)];
  const isExpanded = isItemExpanded(environment, path);
  return 1 + (isExpanded ? item.children?.map(id => countVisibleChildrenIncludingSelf(environment, [...path, id]))?.reduce((a, b) => a + b, 0) ?? 0 : 0);
};

export const getLinearIndexOfItem = (environment: TreeEnvironmentConfiguration, itemPath: TreeItemPath, currentPath?: TreeItemPath): number => {
  currentPath = currentPath ?? [itemPath[0]];

  if (currentPath.length === itemPath.length) {
    return 0;
  }

  const currentItemId = itemPath[currentPath.length - 1];
  const nextItemId = itemPath[currentPath.length];

  const nextItemIndex = environment.data.items[currentItemId].children?.findIndex(child => child === nextItemId);

  if (nextItemIndex === undefined) {
    throw Error(`Err`);
  }

  return 1 + nextItemIndex + getLinearIndexOfItem(environment, itemPath, [...currentPath, nextItemId]);
}

export const getItemPathAtLinearIndex = (environment: TreeEnvironmentConfiguration, rootItem: TreeItemIndex, linearIndex: number, currentPath?: TreeItemPath): TreeItemPath | undefined => {
  currentPath = currentPath ?? [rootItem];

  if (linearIndex <= 0) {
    return currentPath;
  }

  const currentItemId = currentPath[currentPath.length - 1];
  const currentItemChildren = environment.data.items[currentItemId].children;

  for (const childId of currentItemChildren ?? []) {
    const child = environment.data.items[childId];
    linearIndex--;

    if (linearIndex <= 0) {
      return [...currentPath, childId];
    }

    if (child.hasChildren && isItemExpanded(environment, [...currentPath, childId])) {
      const pathFromChild = getItemPathAtLinearIndex(environment, rootItem, linearIndex, [...currentPath, childId]);
      if (pathFromChild) {
        return pathFromChild;
      }
    }
  }

  return undefined;
}