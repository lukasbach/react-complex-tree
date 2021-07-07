import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useMemo, useRef } from 'react';
import { KeyboardBindings } from '../types';
import { defaultKeyboardBindings } from './defaultKeyboardBindings';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

const elementsThatCanTakeText = [
  'input',
  'textarea'
]

export const useHotkey = (
  combinationName: keyof KeyboardBindings,
  onHit: (e: KeyboardEvent) => void,
  active?: boolean,
  activatableWhileFocusingInput = false,
  deps?: any[]
) => {
  const environment = useTreeEnvironment();
  const pressedKeys = useRef<string[]>([]);
  const possibleCombinations = useMemo(
    () =>
      (environment.keyboardBindings?.[combinationName] ?? defaultKeyboardBindings[combinationName]).map(combination =>
        combination.split('+')
      ),
    [combinationName, environment.keyboardBindings]
  );

  useHtmlElementEventListener(
    document,
    'keydown',
    e => {
      if (active === false) {
        return;
      }

      if ((elementsThatCanTakeText.includes((e.target as HTMLElement).tagName.toLowerCase())
        || (e.target as HTMLElement).isContentEditable) && !activatableWhileFocusingInput) {
        return;
      }

      if (!pressedKeys.current.includes(e.key)) {
        pressedKeys.current.push(e.key);
        const pressedKeysLowercase = pressedKeys.current.map(key => key.toLowerCase());

        const partialMatch = possibleCombinations
          .map(combination =>
            pressedKeysLowercase.map(key => combination.includes(key.toLowerCase())).reduce((a, b) => a && b, true)
          )
          .reduce((a, b) => a || b, false);

        if (partialMatch) {
          e.preventDefault();
        }
      }
    },
    [active]
  );

  useHtmlElementEventListener(
    document,
    'keyup',
    e => {
      if (active === false) {
        return;
      }

      const pressedKeysLowercase = pressedKeys.current.map(key => key.toLowerCase());
      const match = possibleCombinations
        .map(combination =>
          combination.map(key => pressedKeysLowercase.includes(key.toLowerCase())).reduce((a, b) => a && b, true)
        )
        .reduce((a, b) => a || b, false);

      if (match) {
        onHit(e);
      }

      pressedKeys.current = pressedKeys.current.filter(key => key !== e.key);
    },
    [possibleCombinations, onHit, active, ...(deps ?? [])]
  );
};
