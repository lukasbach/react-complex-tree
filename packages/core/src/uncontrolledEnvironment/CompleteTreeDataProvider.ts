import {
  Disposable,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from '../types';

export class CompleteTreeDataProvider<T = any>
  implements Required<TreeDataProvider<T>>
{
  private provider: TreeDataProvider;

  constructor(provider: TreeDataProvider) {
    this.provider = provider;
  }

  public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
    return this.provider.getTreeItem(itemId);
  }

  public async getTreeItems(itemIds: TreeItemIndex[]): Promise<TreeItem[]> {
    return this.provider.getTreeItems
      ? this.provider.getTreeItems(itemIds)
      : Promise.all(itemIds.map(id => this.provider.getTreeItem(id)));
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    return this.provider.onChangeItemChildren?.(itemId, newChildren);
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    return this.provider.onDidChangeTreeData
      ? this.provider.onDidChangeTreeData(listener)
      : { dispose: () => {} };
  }

  public async onRenameItem(item: TreeItem<T>, name: string): Promise<void> {
    return this.provider.onRenameItem?.(item, name);
  }
}
