import { ExplicitDataSource, TreeChangeHandlers } from '../types';
import { useCallback, useEffect } from 'react';

// events that should trigger a recalculation of the linear items
const updateEvents: Array<keyof TreeChangeHandlers> = [
  'onCollapseItem',
  'onExpandItem',
  'onRegisterTree',
  'onUnregisterTree',
  'onDrop',
];

export const useUpdateLinearItems = (
  update: () => void,
  changeHandlers: TreeChangeHandlers,
  items: ExplicitDataSource['items']
) => {
  useEffect(update, [update, items]);
  const newChangeHandlers: Partial<TreeChangeHandlers> = {};

  for (const event of updateEvents) {
    const changeHandler = changeHandlers[event] as any;

    // run hook in loop, since the looping array is fixed the hooks will be called consistently
    // eslint-disable-next-line react-hooks/rules-of-hooks
    newChangeHandlers[event] = useCallback<any>(
      (...args: any[]) => {
        changeHandler?.(...args);
        update();
      },
      [changeHandler, update]
    );
  }

  return newChangeHandlers;
};
