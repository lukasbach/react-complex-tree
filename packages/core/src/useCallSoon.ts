import { useCallback, useEffect, useRef } from 'react';

/**
 * React hook that schedules a callback to be run "soon" and will cancel the
 * callback if it is still pending when the component is unmounted.
 *
 * @returns A function that can be used to schedule a deferred callback.
 */
export function useCallSoon(dontClean = false): (callback: () => void) => void {
  const handleRef = useRef(new Array<number>());

  useEffect(() => {
    if (dontClean) {
      return () => {};
    }

    const handles = handleRef.current;
    return () => handles.forEach(handle => cancelAnimationFrame(handle));
  }, [dontClean, handleRef]);

  return useCallback(
    (callback: () => void) => {
      const handle = requestAnimationFrame(() => {
        handleRef.current.splice(handleRef.current.indexOf(handle), 1);

        callback();
      });

      handleRef.current.push(handle);
    },
    [handleRef]
  );
}
