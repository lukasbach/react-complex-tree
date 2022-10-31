import { useHtmlElementEventListener } from '../useHtmlElementEventListener';

export const useKey = (
  key: string,
  onHit: (e: KeyboardEvent) => void,
  active?: boolean
) => {
  useHtmlElementEventListener(document, 'keydown', e => {
    if (!active) {
      return;
    }

    if (active && key.toLowerCase() === e.key.toLowerCase()) {
      onHit(e);
    }
  });
};
