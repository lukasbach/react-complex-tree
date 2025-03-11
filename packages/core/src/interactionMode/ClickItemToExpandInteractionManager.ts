import { HTMLProps } from 'react';
import {
  InteractionMode,
  InteractionManager,
  TreeEnvironmentContextProps,
  TreeItem,
  TreeItemActions,
  TreeItemRenderFlags,
} from '../types';
import { isControlKey } from '../isControlKey';

export class ClickItemToExpandInteractionManager implements InteractionManager {
  public readonly mode = InteractionMode.ClickItemToExpand;

  private environment: TreeEnvironmentContextProps;

  constructor(environment: TreeEnvironmentContextProps) {
    this.environment = environment;
  }

  createInteractiveElementProps(
    item: TreeItem,
    treeId: string,
    actions: TreeItemActions,
    renderFlags: TreeItemRenderFlags
  ): HTMLProps<HTMLElement> {
    return {
      onClick: e => {
        const isSpacebarEvent = e.detail === 0;
        actions.focusItem();
        if (e.shiftKey && !isSpacebarEvent) {
          actions.selectUpTo(!isControlKey(e));
        } else if (isControlKey(e) && !isSpacebarEvent) {
          if (renderFlags.isSelected) {
            actions.unselectItem();
          } else {
            actions.addToSelectedItems();
          }
        } else {
          if (item.isFolder) {
            actions.toggleExpandedState();
          }
          actions.selectItem();

          if (
            !item.isFolder ||
            this.environment.canInvokePrimaryActionOnItemContainer
          ) {
            actions.primaryAction();
          }
        }
      },
      onFocus: () => {
        actions.focusItem();
      },
      onDragStart: e => {
        e.dataTransfer.dropEffect = 'move';
        actions.startDragging();
      },
      onDragOver: e => {
        e.preventDefault(); // Allow drop
      },
      draggable: renderFlags.canDrag && !renderFlags.isRenaming,
      tabIndex: !renderFlags.isRenaming
        ? renderFlags.isFocused
          ? 0
          : -1
        : undefined,
    };
  }
}
