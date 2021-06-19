import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useRef, useState } from 'react';

export const useFocusWithin = (
  element: HTMLElement | undefined,
  onFocusIn?: () => void,
  onFocusOut?: () => void,
  deps: any[] = []
) => {
  // const [focusWithin, setFocusWithin] = useState(false);
  // const isLoosingFocusFlag = useRef(false);

  useHtmlElementEventListener(element, 'focusin', () => {
    // console.log("focusin", element, document.activeElement, isLoosingFocusFlag.current);
    // setFocusWithin(true);
    onFocusIn?.();
    // if (isLoosingFocusFlag.current) {
    //   isLoosingFocusFlag.current = false;
    // }
  }, deps);

  useHtmlElementEventListener(element, 'focusout', (e) => {
    // console.log("focusout", element, document.activeElement, isLoosingFocusFlag.current);
    // isLoosingFocusFlag.current = true;

    if (!element?.contains(document.activeElement)) {
      onFocusOut?.();
    }

    // setTimeout(() => {
    //   if (isLoosingFocusFlag.current /*&& !element?.contains(document.activeElement)*/) {
    //     console.log("focusout with flag", element, document.activeElement, isLoosingFocusFlag.current);
    //     onFocusOut?.();
    //     isLoosingFocusFlag.current = false;
    //     setFocusWithin(false);
    //   }
    // });
  }, deps);

  // return focusWithin;
};