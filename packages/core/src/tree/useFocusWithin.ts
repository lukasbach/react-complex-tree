import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useRef, useState } from 'react';

export const useFocusWithin = (
  element: HTMLElement | undefined,
  onFocusIn?: () => void,
  onFocusOut?: () => void,
  deps: any[] = []
) => {
  const [focusWithin, setFocusWithin] = useState(false);
  const isLoosingFocusFlag = useRef(false);

  useHtmlElementEventListener(
    element,
    'focusin',
    () => {
      if (!focusWithin) {
        setFocusWithin(true);
        onFocusIn?.();
      }

      if (isLoosingFocusFlag.current) {
        isLoosingFocusFlag.current = false;
      }
    },
    [focusWithin, onFocusIn, ...deps]
  );

  useHtmlElementEventListener(
    element,
    'focusout',
    () => {
      isLoosingFocusFlag.current = true;

      requestAnimationFrame(() => {
        if (isLoosingFocusFlag.current && !element?.contains(document.activeElement)) {
          onFocusOut?.();
          isLoosingFocusFlag.current = false;
          setFocusWithin(false);
        }
      });
    },
    [element, onFocusOut, ...deps]
  );

  return focusWithin;
};
