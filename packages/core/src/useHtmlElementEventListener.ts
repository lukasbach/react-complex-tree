import { useSideEffect } from './useSideEffect';

export const useHtmlElementEventListener = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Document | undefined,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  deps: any[] = []
) => {
  useSideEffect(
    () => {
      if (element) {
        element.addEventListener(type, listener as any);
        return () => element.removeEventListener(type, listener as any);
      }
    },
    [element, listener, type],
    deps
  );
};
