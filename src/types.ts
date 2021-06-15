import React, { ButtonHTMLAttributes, ExoticComponent, HTMLProps, InputHTMLAttributes, PropsWithChildren } from 'react';

export type TreeItemIndex = string | number;

export type TreeItem<T = any> = {
  index: TreeItemIndex;
  children?: Array<TreeItemIndex>;
  hasChildren?: boolean;
  // isChildrenLoading?: boolean;
  canMove?: boolean;
  canRename?: boolean;
  data: T;
}

export type TreePosition = {
  parent: TreeItemIndex;
  index: number;
}


export type TreeItemActions = {
  startRenamingItem: () => void;
  expandItem: () => void;
  collapseItem: () => void;
  toggleExpandedState: () => void;
  truncateItem: () => void;
  untruncateItem: () => void;
  toggleTruncatedState: () => void;
  selectItem: () => void;
  unselectItem: () => void;
  addToSelectedItems: () => void;
  // toggleSelectedState: () => void;
}

export type TreeItemRenderContext = TreeItemActions & {
  itemContainerProps: HTMLProps<HTMLElement>;
  isSelected?: boolean;
  isExpanded?: boolean;
  isFocused?: boolean;
  isRenaming?: boolean;
}

export type TreeInformation = {
  areItemsSelected?: boolean;
  isRenaming?: boolean;
}

export type TreeRenderProps<T = any> = {
  renderItem?: (item: TreeItem<T>, depth: number, context: TreeItemRenderContext, info: TreeInformation) => React.ReactNode;
  renderItemTitle: (item: TreeItem<T>, context: TreeItemRenderContext, info: TreeInformation) => string;
  renderRenameInput?: (item: TreeItem<T>, inputProps: Partial<InputHTMLAttributes<HTMLInputElement>>, submitButtonProps: Partial<ButtonHTMLAttributes<HTMLButtonElement>>) => React.ReactNode;
  renderDraggingItem?: (items: Array<TreeItem<T>>) => React.ReactNode;
  renderDraggingItemTitle?: (items: Array<TreeItem<T>>) => React.ReactNode;
  renderDepthOffset?: number;
}

export type AllTreeRenderProps<T = any> = Required<TreeRenderProps<T>>;

export type TreeCapabilities = {
  selectItemOnClick?: boolean;
}

export type TreeViewState = {
  renamingItem?: TreeItemIndex;
  selectedItems?: TreeItemIndex[];
  expandedItems?: TreeItemIndex[];
  untruncatedItems?: TreeItemIndex[];
  focusedItem?: TreeItemIndex;
};

export type ExplicitDataSource<T = any> = {
  items: Record<TreeItemIndex, TreeItem<T>>;
};

export type ImplicitDataSource<T = any> = {
  dataProvider: TreeDataProvider<T>;
}

export type DataSource<T = any> = ExplicitDataSource<T> | ImplicitDataSource<T>;

export type TreeChangeHandlers<T = any> = {
  onStartRenamingItem?: (item: TreeItem<T>) => void;
  onCollapseItem?: (item: TreeItem<T>) => void;
  onExpandItem?: (item: TreeItem<T>) => void;
  onRenameItem?: (item: TreeItem<T>, name: string) => void;
  onSelectItems?: (items: TreeItemIndex[]) => void;
  onStartDrag?: (items: TreeItemIndex[]) => void;
  onFinishDrag?: (items: TreePosition[], target: TreePosition) => void;
  onPrimaryAction?: (items: TreeItem<T>) => void;
  onRegisterTree?: (tree: TreeConfiguration) => void;
  onUnregisterTree?: (tree: TreeConfiguration) => void;
  onMissingItems?: (itemIds: TreeItemIndex[]) => void;
};

export type TreeEnvironmentConfiguration<T = any> = {
  viewState: TreeViewState;
  defaultInteractionMode?: 'click-to-activate' | 'click-to-select';
} & TreeRenderProps<T> & TreeCapabilities & TreeChangeHandlers<T> & ExplicitDataSource<T>;

export type TreeEnvironmentContextProps<T = any> = {
  registerTree: (tree: TreeConfiguration<T>) => void;
  unregisterTree: (treeId: string) => void;
} & TreeEnvironmentConfiguration<T> & AllTreeRenderProps<T>;

export type ControlledTreeEnvironmentProps<T = any> = PropsWithChildren<TreeEnvironmentConfiguration<T>>;

export type UncontrolledTreeEnvironmentProps<T = any> = PropsWithChildren<{
  viewState: TreeViewState;
  defaultInteractionMode?: 'click-to-activate' | 'click-to-select';
} & TreeRenderProps<T> & TreeCapabilities & ImplicitDataSource<T>>;

export type TreeConfiguration<T = any> = {
  treeId: string;
  rootItem: string;
}

export type TreeProps<T = any> = TreeConfiguration<T> & Partial<TreeRenderProps<T>>;

export type TreeDataProvider<T = any> = {
  onDidChangeTreeData?: (listener: (changedItemIds: TreeItemIndex[]) => void) => void;
  getTreeItem: (itemId: TreeItemIndex) => Promise<TreeItem>;
  getTreeItems?: (itemIds: TreeItemIndex[]) => Promise<TreeItem[]>;
  onRenameItem?: (item: TreeItem<T>, name: string) => void;
};

export type CompleteTreeDataProvider<T = any> = Required<TreeDataProvider<T>>;