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
  treeId: string;
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
  startDragging: () => void;
  // toggleSelectedState: () => void;
}

export type TreeItemRenderFlags = {
  isSelected?: boolean;
  isExpanded?: boolean;
  isFocused?: boolean;
  isRenaming?: boolean;
  isDraggingOver?: boolean;
  isDraggingOverParent?: boolean;
};

export type TreeItemRenderContext = {
  interactiveElementProps: HTMLProps<any>;
  containerElementProps: HTMLProps<any>;

} & TreeItemActions & TreeItemRenderFlags;

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
  renderTreeContainer?: (children: React.ReactNode, containerProps: HTMLProps<any>) => React.ReactNode;
  renderDragBetweenLine?: (draggingPosition: DraggingPosition) => React.ReactNode;
}

export type AllTreeRenderProps<T = any> = Required<TreeRenderProps<T>>;

export type TreeCapabilities = {
  selectItemOnClick?: boolean;
}

export type IndividualTreeViewState = {
  renamingItem?: TreeItemIndex;
  selectedItems?: TreeItemIndex[];
  expandedItems?: TreeItemIndex[];
  untruncatedItems?: TreeItemIndex[];
  focusedItem?: TreeItemIndex;
};

export type TreeViewState = {
  [treeId: string]: IndividualTreeViewState;
};

export type ExplicitDataSource<T = any> = {
  items: Record<TreeItemIndex, TreeItem<T>>;
};

export type ImplicitDataSource<T = any> = {
  dataProvider: TreeDataProvider<T>;
}

export type DataSource<T = any> = ExplicitDataSource<T> | ImplicitDataSource<T>;

export type TreeChangeHandlers<T = any> = {
  onStartRenamingItem?: (item: TreeItem<T>, treeId: string) => void;
  onCollapseItem?: (item: TreeItem<T>, treeId: string) => void;
  onExpandItem?: (item: TreeItem<T>, treeId: string) => void;
  onRenameItem?: (item: TreeItem<T>, name: string, treeId: string) => void;
  onSelectItems?: (items: TreeItemIndex[], treeId: string) => void;
  // onStartDrag?: (items: TreeItemIndex[], treeId: string) => void;
  onDrop?: (items: TreePosition[], target: TreePosition) => void;
  onPrimaryAction?: (items: TreeItem<T>, treeId: string) => void;
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
  onStartDraggingItems: (items: TreeItem<T>[], treeId: string) => void;
  draggingItems?: TreeItem<T>[];
  itemHeight: number;
  onDragAtPosition: (position: DraggingPosition | undefined) => void, // TODO
  draggingPosition?: DraggingPosition;
} & TreeEnvironmentConfiguration<T> & AllTreeRenderProps<T>;

export type DraggingPosition = {
  treeId: string;
  targetItem: TreeItemIndex;
  childIndex?: number;
  linearIndex?: number;
  depth: number;
  linePosition?: 'top' | 'bottom';
};

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