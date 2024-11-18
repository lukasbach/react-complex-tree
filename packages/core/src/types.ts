import React, {
  FormHTMLAttributes,
  HTMLProps,
  InputHTMLAttributes,
  Ref,
} from 'react';

export type TreeItemIndex = string | number;

export interface TreeItem<T = any> {
  index: TreeItemIndex;
  children?: Array<TreeItemIndex>;
  isFolder?: boolean;
  // isChildrenLoading?: boolean;
  canMove?: boolean;
  canRename?: boolean;
  data: T;
}

export interface TreePosition {
  treeId: string;
  parent: TreeItemIndex;
  index: number;
}

export interface TreeItemActions {
  primaryAction: () => void;
  startRenamingItem: () => void;
  stopRenamingItem: () => void;
  expandItem: () => void;
  collapseItem: () => void;
  toggleExpandedState: () => void;
  selectItem: () => void;
  unselectItem: () => void;
  addToSelectedItems: () => void;
  selectUpTo: (overrideOldSelection?: boolean) => void;
  startDragging: () => void;

  /** @param setDomFocus - Defaults to true. */
  focusItem: (setDomFocus?: boolean) => void;
  // toggleSelectedState: () => void;
}

export interface TreeItemRenderFlags {
  isSelected?: boolean;
  isExpanded?: boolean;
  isFocused?: boolean;
  isRenaming?: boolean;
  isDraggingOver?: boolean;
  isDraggingOverParent?: boolean;
  isSearchMatching?: boolean;
  canDrag?: boolean;
  canDropOn?: boolean;
}

export interface TreeItemRenderContext<C extends string = never>
  extends TreeItemActions,
    TreeItemRenderFlags {
  interactiveElementProps: HTMLProps<any>;
  itemContainerWithoutChildrenProps: HTMLProps<any>;
  itemContainerWithChildrenProps: HTMLProps<any>;
  arrowProps: HTMLProps<any>;
  viewStateFlags: { [collection in C]: boolean };
}

export interface TreeInformation extends TreeConfiguration {
  areItemsSelected: boolean;
  isRenaming: boolean;
  isFocused: boolean;
  isSearching: boolean;
  search: string | null;
  isProgrammaticallyDragging: boolean;
}

export interface TreeRenderProps<T = any, C extends string = never> {
  renderItem?: (props: {
    item: TreeItem<T>;
    depth: number;
    children: React.ReactNode | null;
    title: React.ReactNode;
    arrow: React.ReactNode;
    context: TreeItemRenderContext<C>;
    info: TreeInformation;
  }) => React.ReactElement | null;

  renderItemTitle?: (props: {
    title: string;
    item: TreeItem<T>;
    context: TreeItemRenderContext<C>;
    info: TreeInformation;
  }) => React.ReactElement | null | string;

  renderItemArrow?: (props: {
    item: TreeItem<T>;
    context: TreeItemRenderContext<C>;
    info: TreeInformation;
  }) => React.ReactElement | null;

  renderRenameInput?: (props: {
    item: TreeItem<T>;
    inputProps: InputHTMLAttributes<HTMLInputElement>;
    inputRef: Ref<HTMLInputElement>;
    submitButtonProps: HTMLProps<any>;
    submitButtonRef: Ref<any>;
    formProps: FormHTMLAttributes<HTMLFormElement>;
  }) => React.ReactElement | null;

  renderItemsContainer?: (props: {
    children: React.ReactNode;
    containerProps: HTMLProps<any>;
    info: TreeInformation;
    depth: number;
    parentId: TreeItemIndex;
  }) => React.ReactElement | null;

  renderTreeContainer?: (props: {
    children: React.ReactNode;
    containerProps: HTMLProps<any>;
    info: TreeInformation;
  }) => React.ReactElement | null;

  renderDragBetweenLine?: (props: {
    draggingPosition: DraggingPosition;
    lineProps: HTMLProps<any>;
  }) => React.ReactElement | null;

  renderSearchInput?: (props: {
    inputProps: HTMLProps<HTMLInputElement>;
  }) => React.ReactElement | null;

  renderLiveDescriptorContainer?: (props: {
    children: React.ReactNode;
    tree: TreeConfiguration;
  }) => React.ReactElement | null;

  renderDepthOffset?: number;
}

export type AllTreeRenderProps<T = any, C extends string = never> = Required<
  TreeRenderProps<T, C>
>;

export enum InteractionMode {
  DoubleClickItemToExpand = 'double-click-item-to-expand',
  ClickItemToExpand = 'click-item-to-expand',
  ClickArrowToExpand = 'click-arrow-to-expand',
}

export interface InteractionManager<C extends string = never> {
  mode: InteractionMode | string;
  extends?: InteractionMode;
  createInteractiveElementProps: (
    item: TreeItem,
    treeId: string,
    actions: TreeItemActions,
    renderFlags: TreeItemRenderFlags,
    /** See https://github.com/lukasbach/react-complex-tree/issues/48 */
    __unsafeViewState?: IndividualTreeViewState<C>
  ) => HTMLProps<HTMLElement>;
}

export interface TreeCapabilities<T = any, C extends string = never> {
  defaultInteractionMode?: InteractionMode | InteractionManager<C>;
  canDragAndDrop?: boolean;
  canDropOnFolder?: boolean;
  canDropOnNonFolder?: boolean;
  canReorderItems?: boolean;
  canDrag?: (items: TreeItem<T>[]) => boolean;
  canDropAt?: (items: TreeItem<T>[], target: DraggingPosition) => boolean;
  canInvokePrimaryActionOnItemContainer?: boolean;
  canSearch?: boolean;
  canSearchByStartingTyping?: boolean;
  canRename?: boolean;
  autoFocus?: boolean;
  doesSearchMatchItem?: (
    search: string,
    item: TreeItem<T>,
    itemTitle: string
  ) => boolean;
  showLiveDescription?: boolean;
  shouldRenderChildren?: (
    item: TreeItem<T>,
    context: TreeItemRenderContext<C>
  ) => boolean;

  /**
   * See Issue #148 or the sample at
   * https://rct.lukasbach.com/storybook/?path=/story/core-basic-examples--single-tree?path=/story/core-drag-and-drop-configurability--can-drop-below-open-folders
   * for details.
   *
   * If enabled, dropping at the bottom of an open folder will drop the items
   * in the parent folder below the hovered item instead of inside the folder
   * at the top.
   */
  canDropBelowOpenFolders?: boolean;

  disableArrowKeys?: boolean;
}

export type IndividualTreeViewState<C extends string = never> = {
  selectedItems?: TreeItemIndex[];
  expandedItems?: TreeItemIndex[];
  focusedItem?: TreeItemIndex;
} & { [c in C]: TreeItemIndex | TreeItemIndex[] | undefined };

export interface TreeViewState<C extends string = never> {
  [treeId: string]: IndividualTreeViewState<C> | undefined;
}

export interface ExplicitDataSource<T = any> {
  items: Record<TreeItemIndex, TreeItem<T>>;
}

export interface ImplicitDataSource<T = any> {
  dataProvider: TreeDataProvider<T>;
}

export type DataSource<T = any> = ExplicitDataSource<T> | ImplicitDataSource<T>;

export interface TreeChangeHandlers<T = any> {
  onStartRenamingItem?: (item: TreeItem<T>, treeId: string) => void;
  onRenameItem?: (item: TreeItem<T>, name: string, treeId: string) => void;
  onAbortRenamingItem?: (item: TreeItem<T>, treeId: string) => void;
  onCollapseItem?: (item: TreeItem<T>, treeId: string) => void;
  onExpandItem?: (item: TreeItem<T>, treeId: string) => void;
  onSelectItems?: (items: TreeItemIndex[], treeId: string) => void; // TODO TreeItem instead of just index
  onFocusItem?: (
    item: TreeItem<T>,
    treeId: string,
    setDomFocus?: boolean
  ) => void;
  onDrop?: (items: TreeItem<T>[], target: DraggingPosition) => void;
  onPrimaryAction?: (items: TreeItem<T>, treeId: string) => void;
  onRegisterTree?: (tree: TreeConfiguration) => void;
  onUnregisterTree?: (tree: TreeConfiguration) => void;
  onMissingItems?: (itemIds: TreeItemIndex[]) => void;
  onMissingChildren?: (itemIds: TreeItemIndex[]) => void; // TODO
}

export interface TreeEnvironmentChangeActions {
  focusTree: (treeId: string, autoFocus?: boolean) => void;
  renameItem: (itemId: TreeItemIndex, name: string, treeId: string) => void;
  collapseItem: (itemId: TreeItemIndex, treeId: string) => void;
  expandItem: (itemId: TreeItemIndex, treeId: string) => void;
  toggleItemExpandedState: (itemId: TreeItemIndex, treeId: string) => void;
  selectItems: (itemsIds: TreeItemIndex[], treeId: string) => void;
  toggleItemSelectStatus: (itemId: TreeItemIndex, treeId: string) => void;
  invokePrimaryAction: (itemId: TreeItemIndex, treeID: string) => void;

  /** @param setDomFocus - Defaults to true. */
  focusItem: (
    itemId: TreeItemIndex,
    treeId: string,
    setDomFocus?: boolean
  ) => void;

  moveFocusUp: (treeId: string) => void;
  moveFocusDown: (treeId: string) => void;
  startProgrammaticDrag: () => void;
  abortProgrammaticDrag: () => void;
  completeProgrammaticDrag: () => void;
  moveProgrammaticDragPositionUp: () => void;
  moveProgrammaticDragPositionDown: () => void;
  expandAll: (treeId: string) => void;
  collapseAll: (treeId: string) => void;
  expandSubsequently: (
    treeId: string,
    itemIds: TreeItemIndex[]
  ) => Promise<void>;
}

export type TreeEnvironmentActionsContextProps = TreeEnvironmentChangeActions;

export interface TreeEnvironmentRef<T = any, C extends string = never>
  extends TreeEnvironmentChangeActions,
    Omit<TreeEnvironmentConfiguration<T, C>, keyof TreeChangeHandlers> {
  treeEnvironmentContext: TreeEnvironmentContextProps;
  dragAndDropContext: DragAndDropContextProps;
  activeTreeId?: string;
  treeIds: string[];
  trees: Record<string, TreeConfiguration>;
}

export interface TreeEnvironmentConfiguration<T = any, C extends string = never>
  extends TreeRenderProps<T, C>,
    TreeCapabilities<T>,
    TreeChangeHandlers<T>,
    ExplicitDataSource<T> {
  viewState: TreeViewState<C>;
  keyboardBindings?: KeyboardBindings;
  liveDescriptors?: LiveDescriptors;
  getItemTitle: (item: TreeItem<T>) => string;
}

export interface TreeEnvironmentContextProps<T = any, C extends string = never>
  extends Omit<TreeEnvironmentConfiguration<T>, keyof TreeRenderProps>,
    AllTreeRenderProps<T, C> {
  registerTree: (tree: TreeConfiguration) => void;
  unregisterTree: (treeId: string) => void;
  activeTreeId?: string;
  setActiveTree: (
    treeIdOrSetStateFunction:
      | string
      | undefined
      | ((prevState: string | undefined) => string | undefined),
    autoFocus?: boolean
  ) => void;
  treeIds: string[];
  trees: Record<string, TreeConfiguration>;
  linearItems: Record<string, LinearItem[]>;
}

export interface DragAndDropContextProps<T = any> {
  onStartDraggingItems: (items: TreeItem<T>[], treeId: string) => void;
  draggingItems?: TreeItem<T>[];
  itemHeight: number;
  isProgrammaticallyDragging?: boolean;
  startProgrammaticDrag: () => void;
  abortProgrammaticDrag: () => void;
  completeProgrammaticDrag: () => void;
  programmaticDragUp: () => void;
  programmaticDragDown: () => void;
  draggingPosition?: DraggingPosition;
  viableDragPositions?: { [treeId: string]: DraggingPosition[] };
  linearItems?: Array<{ item: TreeItemIndex; depth: number }>;
  onDragOverTreeHandler: (
    e: DragEvent,
    treeId: string,
    containerRef: React.MutableRefObject<HTMLElement | undefined>
  ) => void;
  onDragLeaveContainerHandler: (
    e: DragEvent,
    containerRef: React.MutableRefObject<HTMLElement | undefined>
  ) => void;
}

export type DraggingPosition =
  | DraggingPositionItem
  | DraggingPositionBetweenItems
  | DraggingPositionRoot;

export interface AbstractDraggingPosition {
  targetType: 'item' | 'between-items' | 'root';
  treeId: string;
  linearIndex: number;
  depth: number;
}

export interface DraggingPositionItem extends AbstractDraggingPosition {
  targetType: 'item';
  targetItem: TreeItemIndex;
  parentItem: TreeItemIndex;
}

export interface DraggingPositionBetweenItems extends AbstractDraggingPosition {
  targetType: 'between-items';
  childIndex: number;
  linePosition: 'top' | 'bottom';
  parentItem: TreeItemIndex;
}

export interface DraggingPositionRoot extends AbstractDraggingPosition {
  targetType: 'root';
  targetItem: TreeItemIndex;
}

export interface ControlledTreeEnvironmentProps<
  T = any,
  C extends string = never
> extends TreeEnvironmentConfiguration<T, C> {
  children?: JSX.Element | (JSX.Element | null)[] | null;
}

export interface UncontrolledTreeEnvironmentProps<
  T = any,
  C extends string = never
> extends TreeRenderProps<T, C>,
    TreeCapabilities,
    ImplicitDataSource<T>,
    TreeChangeHandlers<T> {
  viewState: TreeViewState<C>;
  keyboardBindings?: KeyboardBindings;
  liveDescriptors?: LiveDescriptors;
  getItemTitle: (item: TreeItem<T>) => string;
  children: JSX.Element | (JSX.Element | null)[] | null;
  disableMultiselect?: boolean;
}

export interface TreeConfiguration {
  treeId: string;
  rootItem: string;
  treeLabel?: string;
  treeLabelledBy?: string;
}

export interface TreeProps<T = any, C extends string = never>
  extends TreeConfiguration,
    Partial<TreeRenderProps<T, C>> {}

export interface TreeContextProps extends TreeConfiguration {
  search: string | null;
  setSearch: (searchValue: string | null) => void;
  renamingItem: TreeItemIndex | null;
  setRenamingItem: (item: TreeItemIndex | null) => void;
  renderers: AllTreeRenderProps;
  treeInformation: TreeInformation;
  getItemsLinearly: () => Array<{ item: TreeItemIndex; depth: number }>;
}

export interface TreeChangeActions {
  focusTree: (autoFocus?: boolean) => void;
  startRenamingItem: (itemId: TreeItemIndex) => void;
  stopRenamingItem: () => void;
  completeRenamingItem: () => void;
  abortRenamingItem: () => void;
  renameItem: (itemId: TreeItemIndex, name: string) => void;
  collapseItem: (itemId: TreeItemIndex) => void;
  expandItem: (itemId: TreeItemIndex) => void;
  toggleItemExpandedState: (itemId: TreeItemIndex) => void;
  selectItems: (itemsIds: TreeItemIndex[]) => void;
  toggleItemSelectStatus: (itemId: TreeItemIndex) => void;

  /** @param setDomFocus - Defaults to true. */
  focusItem: (itemId: TreeItemIndex, setDomFocus?: boolean) => void;

  moveFocusUp: () => void;
  moveFocusDown: () => void;
  invokePrimaryAction: (itemId: TreeItemIndex) => void;
  setSearch: (search: string | null) => void;
  abortSearch: () => void;
  expandAll: () => void;
  collapseAll: () => void;
  expandSubsequently: (itemIds: TreeItemIndex[]) => Promise<void>;
}

export type TreeChangeActionsContextProps = TreeChangeActions;

export interface TreeRef<T = any> extends TreeChangeActions, TreeInformation {
  treeContext: TreeContextProps;
  treeEnvironmentContext: TreeEnvironmentContextProps<T>;
  dragAndDropContext: DragAndDropContextProps<T>;
  search: string | null;
}

export interface TreeDataProvider<T = any> {
  onDidChangeTreeData?: (
    listener: (changedItemIds: TreeItemIndex[]) => void
  ) => Disposable;
  getTreeItem: (itemId: TreeItemIndex) => Promise<TreeItem<T>>;
  getTreeItems?: (itemIds: TreeItemIndex[]) => Promise<TreeItem[]>;
  onRenameItem?: (item: TreeItem<T>, name: string) => Promise<void>;
  onChangeItemChildren?: (
    itemId: TreeItemIndex,
    newChildren: TreeItemIndex[]
  ) => Promise<void>;
}

export type Disposable = {
  dispose: () => void;
};

export interface LinearItem {
  item: TreeItemIndex;
  depth: number;
}

export interface KeyboardBindings {
  primaryAction?: string[];
  moveFocusToFirstItem?: string[];
  moveFocusToLastItem?: string[];
  expandSiblings?: string[];
  renameItem?: string[];
  abortRenameItem?: string[];
  toggleSelectItem?: string[];
  abortSearch?: string[];
  startSearch?: string[];
  selectAll?: string[];
  startProgrammaticDnd?: string[];
  abortProgrammaticDnd?: string[];
  completeProgrammaticDnd?: string[];
}

/**
 * Live descriptors are written in an aria live region describing the state of the
 * tree to accessibility readers. They are displayed in a visually hidden area at the
 * bottom of the tree. Each descriptor composes a HTML string. Variables in the form
 * of \{variableName\} can be used.
 *
 * The \{keybinding:bindingname\} variable refers to a specific keybinding, i.e. \{keybinding:primaryAction\}
 * is a valid variable.
 *
 * See the implementation of the `defaultLiveDescriptors` for more details.
 */
export interface LiveDescriptors {
  /**
   * Supports the following variables:
   * \{treeLabel\} \{keybinding:bindingname\}
   */
  introduction: string;

  /**
   * Supports the following variables:
   * \{renamingItem\} \{keybinding:bindingname\}
   */
  renamingItem: string;

  /**
   * Supports the following variables:
   * \{keybinding:bindingname\}
   */
  searching: string;

  /**
   * Supports the following variables:
   * \{dropTarget\} \{dragItems\} \{keybinding:bindingname\}
   */
  programmaticallyDragging: string;

  /**
   * Will be displayed in addition to the programmaticallyDragging description,
   * but with the aria-live attribute assertive.
   *
   * Supports the following variables:
   * \{dropTarget\} \{dragItems\} \{keybinding:bindingname\}
   */
  programmaticallyDraggingTarget: string;
}

export type HoveringPosition = {
  linearIndex: number;
  offset: 'bottom' | 'top' | undefined;

  // is undefined if tree renderDepthOffset is not set or zero
  indentation: number | undefined;
};
