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
    console.log(`Newly pressed is ${e.key}, pressed were ${pressedKeys.current.join('+')}`)
    if (!pressedKeys.current.includes(e.key)) {
      pressedKeys.current.push(e.key);
    }
  });

  useHtmlElementEventListener(props.containerRef, 'keyup', (e) => {
    console.log(`Released is ${e.key}, pressed were ${pressedKeys.current.join('+')}`)
    if (isActiveTree && pressedKeys.current.length === 1 && e.key === pressedKeys.current[0] && search === null) {
      e.preventDefault();
      const unicode = e.key.charCodeAt(0);
      if (
        (unicode >= 48 && unicode <= 57) || // number
        // (unicode >= 65 && unicode <= 90) || // uppercase letter
        (unicode >= 97 && unicode <= 122) // lowercase letter
      ) {
        setSearch(e.key);
      }
      console.log(e);
      (document.querySelector('[data-rbt-search-input="true"]') as any)?.focus?.();

      pressedKeys.current = [];
    } else {
      pressedKeys.current = pressedKeys.current.filter(key => key !== e.key);
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
