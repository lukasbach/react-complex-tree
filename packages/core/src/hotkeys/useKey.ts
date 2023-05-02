import { useHtmlElementEventListener } from '../useHtmlElementEventListener';

export const useKey = (
  key: string,
  onHit: (e: KeyboardEvent) => void,
  active?: boolean
) => {
  useHtmlElementEventListener(
    typeof document !== 'undefined' ? document : undefined,
    'keydown',
    e => {
      if (!active) {
        return;
      }

      if (active && key.toLowerCase() === e.key.toLowerCase()) {
        onHit(e);
      }
    }
  );
};
