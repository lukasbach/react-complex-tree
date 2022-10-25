import { useCallback } from 'react';
import { useKey } from '../hotkeys/useKey';
import { useHotkey } from '../hotkeys/useHotkey';
import { useMoveFocusToIndex } from './useMoveFocusToIndex';
import { useViewState } from './useViewState';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { useSelectUpTo } from './useSelectUpTo';
import { useLinearItems } from '../controlledEnvironment/useLinearItems';

export const useTreeKeyboardBindings = () => {
  const environment = useTreeEnvironment();
  const { treeId, setRenamingItem, setSearch, renamingItem } = useTree();
  const linearItems = useLinearItems(treeId);
  const dnd = useDragAndDrop();
  const viewState = useViewState();
  const moveFocusToIndex = useMoveFocusToIndex();
  const selectUpTo = useSelectUpTo();

  const isActiveTree = environment.activeTreeId === treeId;
  const isRenaming = !!renamingItem;

  useKey(
    'arrowdown',
    useCallback(
      e => {
        e.preventDefault();
        if (dnd.isProgrammaticallyDragging) {
          dnd.programmaticDragDown();
        } else {
          const newFocusItem = moveFocusToIndex(
            currentIndex => currentIndex + 1
          );

          if (e.shiftKey) {
            selectUpTo(newFocusItem);
          }
        }
      },
      [dnd, moveFocusToIndex, selectUpTo]
    ),
    isActiveTree && !isRenaming
  );

  useKey(
    'arrowup',
    useCallback(
      e => {
        e.preventDefault();
        if (dnd.isProgrammaticallyDragging) {
          dnd.programmaticDragUp();
        } else {
          const newFocusItem = moveFocusToIndex(
            currentIndex => currentIndex - 1
          );

          if (e.shiftKey) {
            selectUpTo(newFocusItem);
          }
        }
      },
      [dnd, moveFocusToIndex, selectUpTo]
    ),
    isActiveTree && !isRenaming
  );

  useHotkey(
    'moveFocusToFirstItem',
    useCallback(
      e => {
        e.preventDefault();
        moveFocusToIndex(() => 0);
      },
      [moveFocusToIndex]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useHotkey(
    'moveFocusToLastItem',
    useCallback(
      e => {
        e.preventDefault();
        moveFocusToIndex((currentIndex, linearItems) => linearItems.length - 1);
      },
      [moveFocusToIndex]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useKey(
    'arrowright',
    useCallback(
      e => {
        e.preventDefault();
        moveFocusToIndex((currentIndex, linearItems) => {
          const item = environment.items[linearItems[currentIndex].item];
          if (item.hasChildren) {
            if (viewState.expandedItems?.includes(item.index)) {
              return currentIndex + 1;
            }
            environment.onExpandItem?.(item, treeId);
          }
          return currentIndex;
        });
      },
      [environment, moveFocusToIndex, treeId, viewState.expandedItems]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useKey(
    'arrowleft',
    useCallback(
      e => {
        e.preventDefault();
        moveFocusToIndex((currentIndex, linearItems) => {
          const item = environment.items[linearItems[currentIndex].item];
          const itemDepth = linearItems[currentIndex].depth;
          if (
            item.hasChildren &&
            viewState.expandedItems?.includes(item.index)
          ) {
            environment.onCollapseItem?.(item, treeId);
          } else if (itemDepth > 0) {
            let parentIndex = currentIndex;
            for (
              parentIndex;
              linearItems[parentIndex].depth !== itemDepth - 1;
              parentIndex--
            );
            return parentIndex;
          }
          return currentIndex;
        });
      },
      [environment, moveFocusToIndex, treeId, viewState.expandedItems]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useHotkey(
    'primaryAction',
    useCallback(
      e => {
        e.preventDefault();
        if (viewState.focusedItem !== undefined) {
          environment.onSelectItems?.([viewState.focusedItem], treeId);
          environment.onPrimaryAction?.(
            environment.items[viewState.focusedItem],
            treeId
          );
        }
      },
      [environment, treeId, viewState.focusedItem]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useHotkey(
    'toggleSelectItem',
    useCallback(
      e => {
        e.preventDefault();
        if (viewState.focusedItem !== undefined) {
          if (
            viewState.selectedItems &&
            viewState.selectedItems.includes(viewState.focusedItem)
          ) {
            environment.onSelectItems?.(
              viewState.selectedItems.filter(
                item => item !== viewState.focusedItem
              ),
              treeId
            );
          } else {
            environment.onSelectItems?.(
              [...(viewState.selectedItems ?? []), viewState.focusedItem],
              treeId
            );
          }
        }
      },
      [environment, treeId, viewState.focusedItem, viewState.selectedItems]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useHotkey(
    'selectAll',
    useCallback(
      e => {
        e.preventDefault();
        environment.onSelectItems?.(
          linearItems.map(({ item }) => item),
          treeId
        );
      },
      [environment, linearItems, treeId]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useHotkey(
    'renameItem',
    useCallback(
      e => {
        if (viewState.focusedItem !== undefined) {
          e.preventDefault();
          const item = environment.items[viewState.focusedItem];
          environment.onStartRenamingItem?.(item, treeId);
          setRenamingItem(item.index);
        }
      },
      [environment, setRenamingItem, treeId, viewState.focusedItem]
    ),
    isActiveTree && (environment.canRename ?? true) && !isRenaming
  );

  useHotkey(
    'startSearch',
    useCallback(
      e => {
        e.preventDefault();
        setSearch('');
        (
          document.querySelector('[data-rct-search-input="true"]') as any
        )?.focus?.();
      },
      [setSearch]
    ),
    isActiveTree && !dnd.isProgrammaticallyDragging && !isRenaming
  );

  useHotkey(
    'startProgrammaticDnd',
    useCallback(
      e => {
        e.preventDefault();
        dnd.startProgrammaticDrag();
      },
      [dnd]
    ),
    isActiveTree && !isRenaming
  );
  useHotkey(
    'completeProgrammaticDnd',
    useCallback(
      e => {
        e.preventDefault();
        dnd.completeProgrammaticDrag();
      },
      [dnd]
    ),
    isActiveTree && dnd.isProgrammaticallyDragging && !isRenaming
  );
  useHotkey(
    'abortProgrammaticDnd',
    useCallback(
      e => {
        e.preventDefault();
        dnd.abortProgrammaticDrag();
      },
      [dnd]
    ),
    isActiveTree && dnd.isProgrammaticallyDragging && !isRenaming
  );
};
