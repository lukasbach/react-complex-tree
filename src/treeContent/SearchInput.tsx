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
  const [search, setSearch] = useState('');
  const keyCounter = useRef(0);
  const isActiveTree = environment.activeTreeId === treeId;

  useHotkey('abortSearch', e => {
    setSearch('');
  }, isActiveTree && search.length > 0, [search, isActiveTree]);

  useHtmlElementEventListener(props.containerRef, 'keydown', e => {
    keyCounter.current = keyCounter.current + 1;
    console.log(`Counter ${keyCounter.current} for key ${e.key}`)
  }, [keyCounter.current]);

  useHtmlElementEventListener(props.containerRef, 'keyup', (e) => {
    if (isActiveTree && keyCounter.current === 1 && search.length === 0) {
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

      keyCounter.current = 0;
    } else {
      console.log(`Skipped, keycounter is ${keyCounter.current}, search length is ${search.length}, tree is ${isActiveTree ? 'active' : 'not active'}`)
      keyCounter.current = keyCounter.current - 1;
    }
  }, [keyCounter.current]);

  if (search.length === 0) {
    return null;
  }

  return renderers.renderSearchInput({
    value: search,
    onChange: (e: any) => setSearch(e.target.value),
    onBlur: () => {
      console.log("BLUR")
      setSearch('');
    },
    ...({
      ['data-rbt-search-input']: 'true'
    } as any)
  }) as any;
};
