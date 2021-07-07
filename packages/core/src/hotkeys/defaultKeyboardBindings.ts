import { KeyboardBindings } from '../types';

export const defaultKeyboardBindings: Required<KeyboardBindings> = {
  expandSiblings: ['control+*'],
  moveFocusToFirstItem: ['home'],
  moveFocusToLastItem: ['end'],
  primaryAction: ['enter'],
  renameItem: ['f2'],
  abortRenameItem: ['escape'],
  toggleSelectItem: ['control+space'],
  abortSearch: ['escape', 'enter'],
  startSearch: [],
  selectAll: ['control+a'],
  startProgrammaticDnd: ['control+d'],
  completeProgrammaticDnd: ['enter'],
  abortProgrammaticDnd: ['escape'],
};
