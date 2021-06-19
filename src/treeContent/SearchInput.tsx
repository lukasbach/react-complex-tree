import * as React from 'react';
import { useContext, useRef, useState } from 'react';
import { TreeConfigurationContext, TreeRenderContext } from './Tree';
import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useHotkey } from '../hotkeys/useHotkey';

export const SearchInput: React.FC<{
  containerRef?: HTMLElement
}> = props => {
  const renderers = useContext(TreeRenderContext);
  const { treeId } = useContext(TreeConfigurationContext);
  const environment = useContext(TreeEnvironmentContext);
  const [search, setSearch] = useState<string | null>(null);
  const pressedKeys = useRef<string[]>([]);
  const isActiveTree = environment.activeTreeId === treeId;

  const clearSearch = () => {
    setSearch(null);

    // Refocus item in tree
    // TODO move logic as reusable method into tree or tree environment
    const focusItem = document.querySelector(`[data-rbt-tree="${treeId}"] [data-rbt-item-focus="true"]`);
    (focusItem as HTMLElement)?.focus?.();
  }

  useHotkey('abortSearch', e => {
    clearSearch();
  }, isActiveTree && search !== null, [search, isActiveTree]);

  useHtmlElementEventListener(props.containerRef, 'keydown', e => {
    const unicode = e.key.charCodeAt(0);
    if (
      isActiveTree &&
      search === null &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      !e.metaKey &&
      (
        (unicode >= 48 && unicode <= 57) || // number
        // (unicode >= 65 && unicode <= 90) || // uppercase letter
        (unicode >= 97 && unicode <= 122) // lowercase letter
      )
    ) {
      setSearch('');
      (document.querySelector('[data-rbt-search-input="true"]') as any)?.focus?.();
    }
  });

  if (search === null) {
    return null;
  }

  return renderers.renderSearchInput({
    value: search,
    onChange: (e: any) => setSearch(e.target.value),
    onBlur: () => {
      console.log("BLUR")
      clearSearch();
    },
    ...({
      ['data-rbt-search-input']: 'true'
    } as any)
  }) as any;
};
