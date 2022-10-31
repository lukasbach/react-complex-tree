import { useRef, useState } from 'react';
import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useCallSoon } from '../useCallSoon';

export const useFocusWithin = (
  element: HTMLElement | undefined,
  onFocusIn?: () => void,
  onFocusOut?: () => void
) => {
  const [focusWithin, setFocusWithin] = useState(false);
  const isLoosingFocusFlag = useRef(false);
  const callSoon = useCallSoon();

  useHtmlElementEventListener(element, 'focusin', () => {
    if (!focusWithin) {
      setFocusWithin(true);
      onFocusIn?.();
    }

    if (isLoosingFocusFlag.current) {
      isLoosingFocusFlag.current = false;
    }
  });

  useHtmlElementEventListener(element, 'focusout', () => {
    isLoosingFocusFlag.current = true;

    callSoon(() => {
      if (
        isLoosingFocusFlag.current &&
        !element?.contains(document.activeElement)
      ) {
        onFocusOut?.();
        isLoosingFocusFlag.current = false;
        setFocusWithin(false);
      }
    });
  });

  return focusWithin;
};
