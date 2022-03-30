import { useCallback, useEffect, useRef } from 'react';

/**
 * React hook that schedules a callback to be run "soon" and will cancel the
 * callback if it is still pending when the component is unmounted.
 *
 * @returns A function that can be used to schedule a deferred callback.
 */
export function useCallSoon(): (callback: () => void) => void {
  // list of pending callbacks
  const handleRef = useRef(new Array<number>());

  // if the component is unmounted, cancel any pending callbacks
  useEffect(() => {
    // can't use handleRef.current in the cleanup function, so we have to
    // assign it to a new variable here.
    const handles = handleRef.current;
    return () => handles.forEach(handle => cancelAnimationFrame(handle));
  }, [handleRef]);

  // schedule callback soon and keep handle for later cancellation
  const callSoon = useCallback(
    (callback: () => void) => {
      const handle = requestAnimationFrame(() => {
        // remove the handle from the list of pending callbacks
        handleRef.current.splice(handleRef.current.indexOf(handle), 1);

        callback();
      });

      handleRef.current.push(handle);
    },
    [handleRef]
  );

  return callSoon;
}
