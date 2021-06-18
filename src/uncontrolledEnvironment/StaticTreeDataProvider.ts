import { Disposable, ExplicitDataSource, TreeDataProvider, TreeItem, TreeItemIndex } from '../types';
import { EventEmitter } from '../EventEmitter';
import { EventListenerManager } from '../EventListenerManager';

export class StaticTreeDataProvider<T = any> implements TreeDataProvider {
  private data: ExplicitDataSource;
  private onDidChangeTreeDataEmitter = new EventEmitter<TreeItemIndex[]>();

  constructor(
    items: Record<TreeItemIndex, TreeItem<T>>,
    // private implicitItemOrdering?: (itemA: TreeItem<T>, itemB: TreeItem<T>) => number,
  ) {
    this.data = { items };
  }

  public async getTreeItem(itemId: TreeItemIndex): Promise<TreeItem> {
    return this.data.items[itemId];
  }

  public async onChangeItemChildren(itemId: TreeItemIndex, newChildren: TreeItemIndex[]): Promise<void> {
    console.log(`Updated item children for ${itemId} with ${newChildren.join(', ')} (old was ${this.data.items[itemId].children?.join(', ')})`);

    // if (this.implicitItemOrdering) {
    //   const orderedChildren = (await Promise.all(newChildren
    //     .map(childId => this.getTreeItem(childId))))
    //     .sort(this.implicitItemOrdering)
    //     .map(item => item.index);
    //   console.log(orderedChildren, newChildren)
    //   this.data.items[itemId].children = orderedChildren;
    // } else {
    //   this.data.items[itemId].children = newChildren;
    // }

    this.data.items[itemId].children = newChildren;

    this.onDidChangeTreeDataEmitter.emit([itemId]);
  }

  public onDidChangeTreeData(listener: (changedItemIds: TreeItemIndex[]) => void): Disposable {
    const handlerId = this.onDidChangeTreeDataEmitter.on(payload => listener(payload));
    return { dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId) };
  }
}