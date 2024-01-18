import { useEffect } from 'react';
import { useStableHandler } from './useStableHandler';

export const useHtmlElementEventListener = <
  K extends keyof HTMLElementEventMap
>(
  element: HTMLElement | Document | undefined,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
) => {
  const stableListener = useStableHandler(listener);
  useEffect(() => {
    if (element) {
      element.addEventListener(type, stableListener as any);
      return () => element.removeEventListener(type, stableListener as any);
    }

    return () => {};
  }, [element, stableListener, type]);
};
