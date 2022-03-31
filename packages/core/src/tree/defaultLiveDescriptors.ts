import { LiveDescriptors } from '../types';

export const defaultLiveDescriptors: LiveDescriptors = {
  introduction: `
    <p>Accessibility guide for tree {treeLabel}.</p>
    <p>
      Navigate the tree with the arrow keys. Common tree hotkeys apply. Further keybindings are available:
    </p>
    <ul>
      <li>{keybinding:primaryAction} to execute primary action on focused item</li>
      <li>{keybinding:renameItem} to start renaming the focused item</li>
      <li>{keybinding:abortRenameItem} to abort renaming an item</li>
      <li>{keybinding:startProgrammaticDnd} to start dragging selected items</li>
    </ul>
  `,

  renamingItem: `
    <p>Renaming the item {renamingItem}.</p>
    <p>Use the keybinding {keybinding:abortRenameItem} to abort renaming.</p>
  `,

  searching: `
    <p>Searching</p>
  `,

  programmaticallyDragging: `
    <p>Dragging items {dragItems}.</p>
    <p>Press the arrow keys to move the drag target.</p>
    <p>Press {keybinding:completeProgrammaticDnd} to drop or {keybinding:abortProgrammaticDnd} to abort.</p>
  `,

  programmaticallyDraggingTarget: `
    <p>Drop target is {dropTarget}.</p>
  `,
};
