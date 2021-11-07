import { useMemo } from 'react';

export const useMemoizedObject = <T extends object>(original: T) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => original, Object.values(original));
};
