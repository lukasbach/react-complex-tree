import { useMemo } from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { defaultKeyboardBindings } from './defaultKeyboardBindings';

export const useKeyboardBindings = () => {
  const environment = useTreeEnvironment();

  return useMemo(() => {
    if (environment.keyboardBindings) {
      return {
        ...defaultKeyboardBindings,
        ...environment.keyboardBindings,
      };
    }
    return defaultKeyboardBindings;
  }, [environment.keyboardBindings]);
};
