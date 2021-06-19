import { KeyboardBindings } from '../types';

export const defaultKeyboardBindings: Required<KeyboardBindings> = {
  abortMovingItems: ['escape'],
  expandSiblings: ['ctrl+*'],
  moveFocusToFirstItem: ['home'],
  moveFocusToLastItem: ['end'],
  primaryAction: ['enter'],
  renameItem: ['f2'],
  moveItems: ['control+m'],
  toggleSelectItem: ['control+space'],
};