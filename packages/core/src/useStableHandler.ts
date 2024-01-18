import { useCallback } from 'react';
import { useRefCopy } from './useRefCopy';

export const useStableHandler = <T extends (...args: any[]) => any>(
  handler: T
) => {
  const handlerRef = useRefCopy<T>(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback<T>(((...args) => handlerRef.current(...args)) as T, [
    handlerRef,
  ]);
};
