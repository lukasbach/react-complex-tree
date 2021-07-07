import * as React from 'react';
import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useHotkey } from '../hotkeys/useHotkey';
import { useTree } from '../tree/Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useSearchMatchFocus } from './useSearchMatchFocus';
import { useViewState } from '../tree/useViewState';

export const SearchInput: React.FC<{
  containerRef?: HTMLElement;
}> = props => {
  const { search, setSearch, treeId, renderers, renamingItem } = useTree();
  const environment = useTreeEnvironment();
  useViewState();
  const isActiveTree = environment.activeTreeId === treeId;

  useSearchMatchFocus();

  const clearSearch = () => {
    setSearch(null);

    if (environment.autoFocus ?? true) {
      // Refocus item in tree
      // TODO move logic as reusable method into tree or tree environment
      const focusItem = document.querySelector(`[data-rct-tree="${treeId}"] [data-rct-item-focus="true"]`);
      (focusItem as HTMLElement)?.focus?.();
    }
  };

  useHotkey(
    'abortSearch',
    () => {
      // Without the requestAnimationFrame, hitting enter to abort
      // and then moving focus weirdly moves the selected item along
      // with the focused item.
      requestAnimationFrame(() => {
        clearSearch();
      });
    },
    isActiveTree && search !== null,
    true,
    [search, isActiveTree]
  );

  useHtmlElementEventListener(
    props.containerRef,
    'keydown',
    e => {
      const unicode = e.key.charCodeAt(0);
      if (
        (environment.canSearch ?? true) &&
        (environment.canSearchByStartingTyping ?? true) &&
        isActiveTree &&
        search === null &&
        !renamingItem &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey &&
        ((unicode >= 48 && unicode <= 57) || // number
          // (unicode >= 65 && unicode <= 90) || // uppercase letter
          (unicode >= 97 && unicode <= 122)) // lowercase letter
      ) {
        setSearch('');

        (document.querySelector('[data-rct-search-input="true"]') as any)?.focus?.();
      }
    },
    [isActiveTree, search, renamingItem, environment.canSearchByStartingTyping, environment.canSearch]
  );

  if (!(environment.canSearch ?? true) || search === null) {
    return null;
  }

  return renderers.renderSearchInput({
    inputProps: {
      value: search,
      onChange: (e: any) => setSearch(e.target.value),
      onBlur: () => {
        clearSearch();
      },
      'aria-label': 'Search for items', // TODO
      ...({
        ['data-rct-search-input']: 'true',
      } as any),
    },
  }) as any;
};
