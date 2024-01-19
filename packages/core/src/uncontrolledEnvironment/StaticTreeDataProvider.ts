import {
  Disposable,
  ExplicitDataSource,
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from '../types';
import { EventEmitter } from '../EventEmitter';

export class StaticTreeDataProvider<T = any> implements TreeDataProvider {
  private data: ExplicitDataSource;

  /** Emit an event with the changed item ids to notify the tree view about changes. */
  public readonly onDidChangeTreeDataEmitter = new EventEmitter<
    TreeItemIndex[]
  >();

  private setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>;

  constructor(
    items: Record<TreeItemIndex, TreeItem<T>>,
    setItemName?: (item: TreeItem<T>, newName: string) => TreeItem<T>
    // private implicitItemOrdering?: (itemA: TreeItem<T>, itemB: TreeItem<T>) => number,
  ) {
    this.data = { items };
    this.setItemName = setItemName;
  }

  public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
    return this.data.items[itemId];
  }

  public async onChangeItemChildren(
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ): Promise<void> {
    this.data.items[itemId].children = newChildren;
    this.onDidChangeTreeDataEmitter.emit([itemId]);
  }

  public onDidChangeTreeData(
    listener: (changedItemIds: TreeItemIndex[]) => void
  ): Disposable {
    const handlerId = this.onDidChangeTreeDataEmitter.on(payload =>
      listener(payload)
    );
    return { dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId) };
  }

  public async onRenameItem(item: TreeItem<any>, name: string): Promise<void> {
    if (this.setItemName) {
      this.data.items[item.index] = this.setItemName(item, name);
      // this.onDidChangeTreeDataEmitter.emit(item.index);
    }
  }
}
