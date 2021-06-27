import { KeyboardBindings } from '../types';

export const defaultKeyboardBindings: Required<KeyboardBindings> = {
  abortMovingItems: ['escape'],
  expandSiblings: ['control+*'],
  moveFocusToFirstItem: ['home'],
  moveFocusToLastItem: ['end'],
  primaryAction: ['enter'],
  renameItem: ['f2'],
  abortRenameItem: ['escape'],
  moveItems: ['control+m'],
  toggleSelectItem: ['control+space'],
  abortSearch: ['escape', 'enter'],
  startSearch: [],
  selectAll: ['control+a'],
  startProgrammaticDnd: ['control+b'],
  completeProgrammaticDnd: ['enter'],
  abortProgrammaticDnd: ['escape']
};