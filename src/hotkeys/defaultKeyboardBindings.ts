import { KeyboardBindings } from '../types';

export const defaultKeyboardBindings: Required<KeyboardBindings> = {
  abortMovingItems: ['escape'],
  completeMovingItems: ['enter'],
  expandSiblings: ['ctrl+*'],
  moveFocusToFirstItem: ['home'],
  moveFocusToLastItem: ['end'],
  primaryAction: ['enter'],
  renameItem: ['f2'],
  startMovingItems: ['ctrl+m'],
  toggleSelectItem: ['space'],
};