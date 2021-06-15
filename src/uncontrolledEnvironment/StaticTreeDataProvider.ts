import { ExplicitDataSource, TreeDataProvider, TreeItem, TreeItemIndex } from '../types';

export class StaticTreeDataProvider<T = any> implements TreeDataProvider {
  private data: ExplicitDataSource;

  constructor(items: Record<TreeItemIndex, TreeItem<T>>) {
    this.data = { items };
  }

  public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
    return this.data.items[itemId];
  }

  public onRenameItem(item: TreeItem<any>, name: string): void {
  }
}