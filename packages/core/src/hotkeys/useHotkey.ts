import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useContext, useMemo, useRef } from 'react';
import { KeyboardBindings } from '../types';
import { defaultKeyboardBindings } from './defaultKeyboardBindings';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';

export const useHotkey = (combinationName: keyof KeyboardBindings, onHit: (e: KeyboardEvent) => void, active?: boolean, deps?: any[]) => {
  const environment = useTreeEnvironment();
  const pressedKeys = useRef<string[]>([]);
  const possibleCombinations = useMemo(
    () => environment.keyboardBindings?.[combinationName] ?? defaultKeyboardBindings[combinationName],
    [combinationName, environment.keyboardBindings]
  );

  useHtmlElementEventListener(document, 'keydown', e => {
    if (active === false) {
      return;
    }

    if (!pressedKeys.current.includes(e.key)) {
      pressedKeys.current.push(e.key);
    }
  }, [active]);

  useHtmlElementEventListener(document, 'keyup', e => {
    if (active === false) {
      return;
    }

    const pressedKeysLowercase = pressedKeys.current.map(key => key.toLowerCase());
    const match = possibleCombinations.map(combination => combination
      .split('+')
      .map(key => pressedKeysLowercase.includes(key.toLowerCase()))
      .reduce((a, b) => a && b, true)).reduce((a, b) => a || b, false);

    if (match) {
      onHit(e);
    }

    pressedKeys.current = pressedKeys.current.filter(key => key !== e.key);
  }, [possibleCombinations, onHit, active, ...deps ?? []]);
};
