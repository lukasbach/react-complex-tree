/*import {
  CompleteTreeDataProvider,
  ControlledTreeEnvironmentProps,
  ExplicitDataSource,
  ImplicitDataSource, TreeChangeHandlers, TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from '../types';
import { useEffect, useRef, useState } from 'react';

const createCompleteDataProvider = <T>(provider: TreeDataProvider<T>): CompleteTreeDataProvider<T> => ({
  ...provider,
  onDidChangeTreeData: provider.onDidChangeTreeData ?? (() => {}),
  getTreeItems: provider.getTreeItems ?? (itemIds => Promise.all(itemIds.map(provider.getTreeItem))),
})

export const useDataSource = <T>(environment: ControlledTreeEnvironmentProps<T>): {
  items: Record<TreeItemIndex, TreeItem<T>>,
  changeHandlers: TreeChangeHandlers<T>,
} => {
  const [currentItems, setCurrentItems] = useState<Record<TreeItemIndex, TreeItem<T>>>({});
  const changeHandlers = useRef<TreeChangeHandlers<T>>(environment);

  useEffect(() => {
    if ((environment as ImplicitDataSource<T>).dataProvider !== undefined) {
      const dataProvider = createCompleteDataProvider((environment as ImplicitDataSource<T>).dataProvider);

      changeHandlers.current.onExpandItem = item => {
        environment.onExpandItem?.(item);
        const itemsToLoad = item.children?.filter(itemId => currentItems[itemId] === undefined) ?? [];
        dataProvider.getTreeItems(itemsToLoad).then(items => {

        })
      }
    }
  }, [])

  if ((environment as ExplicitDataSource<T>).items !== undefined) {
    return {
      items: (environment as ExplicitDataSource<T>).items,
      changeHandlers: changeHandlers.current
    };
  } else {
    return {
      items: currentItems,
      changeHandlers: changeHandlers.current
    };
  }
};*/