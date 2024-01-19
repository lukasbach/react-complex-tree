import { Meta } from '@storybook/react';
import { useMemo, useState } from 'react';
import * as React from 'react';
import { longTree, shortTree } from 'demodata';
import { action } from '@storybook/addon-actions';
import { Tree } from '../tree/Tree';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { buildTestTree } from '../../test/helpers';
import {
  Disposable,
  ExplicitDataSource,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from '../types';
import { EventEmitter } from '../EventEmitter';

export default {
  title: 'Core/Data Provider',
} as Meta;

export const InjectingDataFromOutside = () => {
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
    items.root.children.pop();
    dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
  };

  return (
    <UncontrolledTreeEnvironment<string>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{
        'tree-1': {
          expandedItems: [],
        },
      }}
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
    console.log(this.data);
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
          expandedItems: [],
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
