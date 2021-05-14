import React, { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from 'react';

export type TreeItemIndex = string | number;
export type TreeItemPath = TreeItemIndex[];

export type TreeItem<T = any> = {
  index: TreeItemIndex;
  children?: Array<TreeItemIndex>;
  hasChildren?: boolean;
  isChildrenLoading?: boolean;
  // isExpanded?: boolean;
  // isTruncated?: boolean;
  // isSelected?: boolean;
  canMove?: boolean;
  canRename?: boolean;
}

export type TreePosition = {
  parentPath: TreeItemPath;
  index: number;
}

export type TreeData<T = any> = {
  items: Record<TreeItemIndex, TreeItem<T>>;
}

export type TreeItemActions = {
  startRenamingItem?: () => void;
  expandItem?: () => void;
  collapseItem?: () => void;
  toggleExpandedState?: () => void;
  truncateItem?: () => void;
  untruncateItem?: () => void;
  toggleTruncatedState?: () => void;
  selectItem?: () => void;
  unselectItem?: () => void;
  toggleSelectedState?: () => void;
}

export type TreeInformation = {
  areItemsSelected?: boolean;
  isRenaming?: boolean;
}

export type TreeRenderProps<T = any> = {
  renderItem: (item: T, actions: TreeItemActions, info: TreeInformation) => React.ReactNode;
  renderItemTitle: (item: T, actions: TreeItemActions, info: TreeInformation) => React.ReactNode;
  renderRenameInput: (item: T, inputProps: Partial<InputHTMLAttributes<HTMLInputElement>>, submitButtonProps: Partial<ButtonHTMLAttributes<HTMLButtonElement>>) => React.ReactNode;
  renderDraggingItem?: (items: T[]) => React.ReactNode;
  renderDraggingItemTitle?: (items: T[]) => React.ReactNode;
  renderDepthOffset?: number;
}

export type TreeCapabilities = {
  selectItemOnClick?: boolean;
}

export type TreeEnvironmentConfiguration<T = any> = {
  data: TreeData<T>;
  renamingItem?: TreeItemPath;
  selectedItems?: TreeItemPath[];
  expandedItems?: TreeItemPath[];
  untruncatedItems?: TreeItemPath[];

  onStartRenamingItem?: (item: TreeItem<T>) => void;
  onRenameItem?: (item: TreeItem<T>, name: string) => void;
  onSelectItems?: (items: TreeItemPath[]) => void;
  onStartDrag?: (items: TreeItemPath[]) => void;
  onFinishDrag?: (items: TreePosition[], target: TreePosition) => void;
} & TreeRenderProps<T> & TreeCapabilities;

export type TreeEnvironmentContextProps<T = any> = {
  registerTree: (tree: TreeConfiguration<T>) => void;
  unregisterTree: (treeId: string) => void
} & TreeEnvironmentConfiguration<T>;

export type ControlledTreeEnvironmentProps<T = any> = PropsWithChildren<TreeEnvironmentConfiguration<T>>;

// export type UncontrolledTreeEnvironmentProps<T = any> = {
//
// } & TreeRenderProps<T> & TreeCapabilities;

export type TreeConfiguration<T = any> = {
  treeId: string;
  rootItem: string;
}

export type TreeProps<T = any> = TreeConfiguration<T> & TreeRenderProps<T>;