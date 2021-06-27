import { useKey } from '../hotkeys/useKey';
import { useHotkey } from '../hotkeys/useHotkey';
import { useMoveFocusToIndex } from './useMoveFocusToIndex';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useGetLinearItems } from './useGetLinearItems';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';

export const useTreeKeyboardBindings = (containerRef?: HTMLElement) => {
  const environment = useTreeEnvironment();
  const { treeId, setRenamingItem, setSearch } = useTree();
  const dnd = useDragAndDrop();
  const viewState = useViewState();
  const moveFocusToIndex = useMoveFocusToIndex(containerRef);
  const getLinearItems = useGetLinearItems();

  const isActiveTree = environment.activeTreeId === treeId;

  useKey('arrowdown', (e) => {
    e.preventDefault();
    if (dnd.isProgrammaticallyDragging) {
      dnd.programmaticDragDown();
    } else {
      moveFocusToIndex(currentIndex => currentIndex + 1);
    }
  }, isActiveTree);

  useKey('arrowup', (e) => {
    e.preventDefault();
    if (dnd.isProgrammaticallyDragging) {
      dnd.programmaticDragUp();
    } else {
      moveFocusToIndex(currentIndex => currentIndex - 1);
    }
  }, isActiveTree);

  useHotkey('moveFocusToFirstItem', e => {
    e.preventDefault();
    moveFocusToIndex(() => 0);
  }, isActiveTree);

  useHotkey('moveFocusToLastItem', e => {
    e.preventDefault();
    moveFocusToIndex((currentIndex, linearItems) => linearItems.length - 1);
  }, isActiveTree);

  useKey('arrowright', (e) => {
    e.preventDefault();
    moveFocusToIndex((currentIndex, linearItems) => {
      const item = environment.items[linearItems[currentIndex].item];
      if (item.hasChildren) {
        if (viewState.expandedItems?.includes(item.index)) {
          return currentIndex + 1;
        } else {
          environment.onExpandItem?.(item, treeId);
        }
      }
      return currentIndex;
    });
  }, isActiveTree);

  useKey('arrowleft', (e) => {
    e.preventDefault();
    moveFocusToIndex((currentIndex, linearItems) => {
      const item = environment.items[linearItems[currentIndex].item];
      const itemDepth = linearItems[currentIndex].depth;
      if (item.hasChildren && viewState.expandedItems?.includes(item.index)) {
        environment.onCollapseItem?.(item, treeId);
      } else if (itemDepth > 0) {
        let parentIndex = currentIndex;
        for (parentIndex; linearItems[parentIndex].depth !== itemDepth - 1; parentIndex--);
        return parentIndex;
      }
      return currentIndex;
    });
  }, isActiveTree);

  useHotkey('primaryAction', e => {
    e.preventDefault();
    if (viewState.focusedItem) {
      environment.onSelectItems?.([viewState.focusedItem], treeId);
      environment.onPrimaryAction?.(environment.items[viewState.focusedItem], treeId);
    }
  }, isActiveTree);

  useHotkey('toggleSelectItem', e => {
    e.preventDefault();
    if (viewState.focusedItem) {
      if (viewState.selectedItems && viewState.selectedItems.includes(viewState.focusedItem)) {
        environment.onSelectItems?.(viewState.selectedItems.filter(item => item !== viewState.focusedItem), treeId);
      } else {
        environment.onSelectItems?.([...viewState.selectedItems ?? [], viewState.focusedItem], treeId);
      }
    }
  }, isActiveTree);

  useHotkey('selectAll', e => {
    e.preventDefault();
    environment.onSelectItems?.(getLinearItems().map(({ item }) => item), treeId);
  }, isActiveTree);

  useHotkey('moveItems', e => {
    e.preventDefault();
    const selectedItems = viewState.selectedItems?.length ?? 0 > 0
      ? viewState.selectedItems : Object.values(environment.viewState)
      .find(state => state?.selectedItems?.length ?? 0 > 0)?.selectedItems
      ?? null;

    if (selectedItems) {
      // TODO move
    }
  }, isActiveTree);

  useHotkey('renameItem', e => {
    if (viewState.focusedItem) {
      e.preventDefault();
      const item = environment.items[viewState.focusedItem];
      environment.onStartRenamingItem?.(item, treeId);
      setRenamingItem(item.index);
    }
  }, isActiveTree);

  useHotkey('startSearch', e => {
    e.preventDefault();
    setSearch('');
    (document.querySelector('[data-rct-search-input="true"]') as any)?.focus?.();
  }, isActiveTree);


  useHotkey('startProgrammaticDnd', e => {
    e.preventDefault();
    dnd.startProgrammaticDrag();
  }, isActiveTree);
  useHotkey('completeProgrammaticDnd', e => {
    e.preventDefault();
    dnd.completeProgrammaticDrag();
  }, isActiveTree);
  useHotkey('abortProgrammaticDnd', e => {
    e.preventDefault();
    dnd.abortProgrammaticDrag();
  }, isActiveTree);

}