import { Meta } from '@storybook/react';
import { useEffect, useMemo, useRef } from 'react';
import * as React from 'react';
import { shortTree } from 'demodata';
import { Tree } from '../tree/Tree';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import {
  Disposable,
  TreeDataProvider,
  TreeEnvironmentRef,
  TreeItem,
  TreeItemIndex,
} from '../types';

export default {
  title: 'Core/Data Provider',
} as Meta;

export const InjectingDataFromOutside = () => {
  const treeEnv = useRef<TreeEnvironmentRef>(null);
  const items = useMemo(() => ({ ...shortTree.items }), []);
  const dataProvider = useMemo(
    () =>
      new StaticTreeDataProvider(items, (item, data) => ({
        ...item,
        data,
      })),
    [items]
  );

  const injectItem = () => {
    const rand = `${Math.random()}`;
    items[rand] = { data: 'New Item', index: rand } as TreeItem;
    items.root.children.push(rand);
    dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
  };

  const removeItem = () => {
    if (items.root.children.length === 0) return;
    const item = items.root.children.pop();
    delete items[item];
    dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
  };

  useEffect(
    () =>
      dataProvider.onDidChangeTreeData(changedItemIds => {
        console.log('Changed Item IDs:', changedItemIds);

        const focusedItem = treeEnv.current?.viewState['tree-1']?.focusedItem;
        if (focusedItem && !items[focusedItem]) {
          console.log('Focused item was deleted, refocusing new item...');
          treeEnv.current.focusItem(items.root.children[0], 'tree-1');
        }
      }).dispose,
    [dataProvider, items]
  );

  return (
    <UncontrolledTreeEnvironment<string>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{
        'tree-1': {
          expandedItems: ['container'],
        },
      }}
      ref={treeEnv}
    >
      <button type="button" onClick={injectItem}>
        Inject item
      </button>
      <button type="button" onClick={removeItem}>
        Remove item
      </button>
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
};

class CustomDataProviderImplementation implements TreeDataProvider {
  private data: Record<TreeItemIndex, TreeItem> = { ...shortTree.items };

  private treeChangeListeners: ((changedItemIds: TreeItemIndex[]) => void)[] =
    [];

  public async getTreeItem(itemId: TreeItemIndex) {
    return this.data[itemId];
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ) {
    this.data[itemId].children = newChildren;
    this.treeChangeListeners.forEach(listener => listener([itemId]));
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    this.treeChangeListeners.push(listener);
    return {
      dispose: () =>
        this.treeChangeListeners.splice(
          this.treeChangeListeners.indexOf(listener),
          1
        ),
    };
  }

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    this.data[item.index].data = name;
  }

  public injectItem(name: string) {
    const rand = `${Math.random()}`;
    this.data[rand] = { data: name, index: rand } as TreeItem;
    this.data.root.children?.push(rand);
    this.treeChangeListeners.forEach(listener => listener(['root']));
  }
}

export const CustomDataProvider = () => {
  const dataProvider = useMemo(
    () => new CustomDataProviderImplementation(),
    []
  );

  return (
    <UncontrolledTreeEnvironment<string>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{
        'tree-1': {
          expandedItems: ['container'],
        },
      }}
    >
      <button
        type="button"
        onClick={() =>
          dataProvider.injectItem(window.prompt('Item name') ?? 'New item')
        }
      >
        Inject item
      </button>
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
};
