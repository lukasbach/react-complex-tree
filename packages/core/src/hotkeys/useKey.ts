import { useHtmlElementEventListener } from '../useHtmlElementEventListener';

export const useKey = (key: string, onHit: (e: KeyboardEvent) => void, active?: boolean, deps?: any[]) => {
  useHtmlElementEventListener(
    document,
    'keydown',
    e => {
      if (!active) {
        return;
      }

      if (active && key.toLowerCase() === e.key.toLowerCase()) {
        onHit(e);
      }
    },
    [active, key, ...(deps ?? [])]
  );
};
