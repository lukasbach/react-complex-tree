import { useEffect } from 'react';

export const useHtmlElementEventListener = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Document | undefined,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  deps: any[] = []
) => {
  useEffect(() => {
    if (element) {
      element.addEventListener(type, listener as any);
      return () => element.removeEventListener(type, listener as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, listener, type, ...deps]);
};
