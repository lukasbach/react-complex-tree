import { useMemo, useRef } from 'react';
import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { KeyboardBindings } from '../types';
import { useKeyboardBindings } from './useKeyboardBindings';
import { useCallSoon } from '../useCallSoon';
import { getDocument } from '../utils';

const elementsThatCanTakeText = ['input', 'textarea'];

export const useHotkey = (
  combinationName: keyof KeyboardBindings,
  onHit: (e: KeyboardEvent) => void,
  active?: boolean,
  activatableWhileFocusingInput = false
) => {
  const pressedKeys = useRef<string[]>([]);
  const keyboardBindings = useKeyboardBindings();
  const callSoon = useCallSoon();

  const possibleCombinations = useMemo(
    () =>
      keyboardBindings[combinationName].map(combination =>
        combination.split('+')
      ),
    [combinationName, keyboardBindings]
  );

  useHtmlElementEventListener(getDocument(), 'keydown', e => {
    if (active === false) {
      return;
    }

    if (
      (elementsThatCanTakeText.includes(
        (e.target as HTMLElement).tagName?.toLowerCase()
      ) ||
        (e.target as HTMLElement).isContentEditable) &&
      !activatableWhileFocusingInput
    ) {
      // Skip if an input is selected
      return;
    }

    if (!pressedKeys.current.includes(e.key)) {
      pressedKeys.current.push(e.key);
      const pressedKeysLowercase = pressedKeys.current.map(key =>
        key.toLowerCase()
      );

      const partialMatch = possibleCombinations
        .map(combination =>
          pressedKeysLowercase
            .map(key => combination.includes(key.toLowerCase()))
            .reduce((a, b) => a && b, true)
        )
        .reduce((a, b) => a || b, false);

      if (partialMatch) {
        if (pressedKeys.current.length > 1 || !/^[a-zA-Z\s]$/.test(e.key)) {
          // Prevent default, but not if this is the first input and a letter (which should trigger a search)
          // also not on first input and spacebar, as that should trigger an item directly
          e.preventDefault();
        }
      }
    }
  });

  useHtmlElementEventListener(getDocument(), 'keyup', e => {
    if (active === false) {
      return;
    }

    const pressedKeysLowercase = pressedKeys.current.map(key =>
      key.toLowerCase()
    );
    const match = possibleCombinations
      .map(combination =>
        combination
          .map(key => pressedKeysLowercase.includes(key.toLowerCase()))
          .reduce((a, b) => a && b, true)
      )
      .reduce((a, b) => a || b, false);

    if (match) {
      callSoon(() => onHit(e));
    }

    pressedKeys.current = pressedKeys.current.filter(key => key !== e.key);
  });
};
