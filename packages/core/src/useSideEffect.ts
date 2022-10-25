import { DependencyList, useEffect, useRef } from 'react';

export const useSideEffect = (
  effect: Function,
  deps: DependencyList,
  changeOn: DependencyList
): void => {
  const previousRef = useRef<typeof changeOn>();
  useEffect(() => {
    if (!previousRef.current) {
      previousRef.current = [...changeOn];
      effect();
    } else {
      const changed = previousRef.current.some((v, i) => v !== changeOn[i]);
      if (changed) {
        previousRef.current = [...changeOn];
        effect();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, ...changeOn]);
};
