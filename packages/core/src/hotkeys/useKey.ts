import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { getDocument } from '../utils';

export const useKey = (
  key: string,
  onHit: (e: KeyboardEvent) => void,
  active?: boolean
) => {
  useHtmlElementEventListener(getDocument(), 'keydown', e => {
    if (!active) {
      return;
    }

    if (active && key.toLowerCase() === e.key.toLowerCase()) {
      onHit(e);
    }
  });
};
