import * as React from 'react';
import {
  CompleteTreeDataProvider,
  ControlledTreeEnvironmentProps,
  ImplicitDataSource, IndividualTreeViewState,
  TreeConfiguration, TreeDataProvider, TreeItem, TreeItemIndex, TreeViewState,
  UncontrolledTreeEnvironmentProps,
} from '../types';
import { useEffect, useMemo, useState } from 'react';
import { ControlledTreeEnvironment, TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';

const createCompleteDataProvider = (provider: TreeDataProvider): CompleteTreeDataProvider => ({
  ...provider,
  onDidChangeTreeData: provider.onDidChangeTreeData ?? (() => {}),
  getTreeItems: provider.getTreeItems ?? (itemIds => Promise.all(itemIds.map(id => provider.getTreeItem(id)))),
  onRenameItem: provider.onRenameItem ?? (() => {}),
});

export const UncontrolledTreeEnvironment = <T extends any>(props: UncontrolledTreeEnvironmentProps<T>) => {
  const [currentItems, setCurrentItems] = useState<Record<TreeItemIndex, TreeItem<T>>>({});
  const [viewState, setViewState] = useState(props.viewState);
  const dataProvider = createCompleteDataProvider(props.dataProvider);

  const writeItems = useMemo(() => (newItems: Record<TreeItemIndex, TreeItem<T>>) => {
    setCurrentItems(oldItems => ({ ...oldItems, ...newItems }));
  }, []);

  const amendViewState = (treeId: string, constructNewState: (oldState: IndividualTreeViewState) => Partial<IndividualTreeViewState>) => {
    setViewState(oldState => ({
      ...oldState,
      [treeId]: {
        ...oldState[treeId],
        ...constructNewState(oldState[treeId]),
      }
    }));
  }


  return (
    <ControlledTreeEnvironment
      {...props}
      viewState={viewState}
      items={currentItems}
      onExpandItem={(item, treeId) => {
        amendViewState(treeId, old => ({ ...old, expandedItems: [...old.expandedItems ?? [], item.index] }));
        //const itemsToLoad = item.children?.filter(itemId => currentItems[itemId] === undefined) ?? [];
        //dataProvider.getTreeItems(itemsToLoad).then(items => {
        //  writeItems(items.map(item => ({ [item.index]: item })).reduce((a, b) => ({...a, ...b}), {}));
        //  setViewState(viewState => ({ ...viewState, expandedItems: [...viewState.expandedItems ?? [], item.index] }));
        //});
      }}
      onCollapseItem={(item, treeId) => {
        amendViewState(treeId, old => ({ ...old, expandedItems: old.expandedItems?.filter(id => id !== item.index) }));
      }}
      onSelectItems={(items, treeId) => {
        amendViewState(treeId, old => ({ ...old, selectedItems: items }));
      }}
      onStartRenamingItem={(item, treeId) => {
        amendViewState(treeId, old => ({ ...old, renamingItem: item.index }));
      }}
      onRenameItem={(item, name, treeId) => {
        dataProvider.onRenameItem(item, name);
        amendViewState(treeId, old => ({ ...old, renamingItem: undefined }));
      }}
      onMissingItems={itemIds => {
        console.log(`Retrieving items ${itemIds.join(', ')}`)
        dataProvider.getTreeItems(itemIds).then(items => {
          console.log(`Retrieved ${items.map(i => i.index).join(', ')}`)
          writeItems(items.map(item => ({ [item.index]: item })).reduce((a, b) => ({...a, ...b}), {}));
        });
      }}
      // onRegisterTree={tree => {
      //   dataProvider.getTreeItem(tree.rootItem).then(item => writeItems({ [item.index]: item }));
      // }}
    >
      {props.children}
    </ControlledTreeEnvironment>
  );
};
