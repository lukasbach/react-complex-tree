import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useMemo } from 'react';
import { defaultKeyboardBindings } from './defaultKeyboardBindings';

export const useKeyboardBindings = () => {
  const environment = useTreeEnvironment();

  return useMemo(() => {
    if (environment.keyboardBindings) {
      return {
        ...defaultKeyboardBindings,
        ...environment.keyboardBindings,
      };
    } else {
      return defaultKeyboardBindings;
    }
  }, [environment.keyboardBindings]);
};
