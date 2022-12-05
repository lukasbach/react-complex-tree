import {
  DragAndDropContextProps,
  KeyboardBindings,
  TreeContextProps,
  TreeEnvironmentContextProps,
  TreeItemIndex,
} from '../types';

export const resolveLiveDescriptor = (
  descriptor: string,
  environment: TreeEnvironmentContextProps,
  dnd: DragAndDropContextProps,
  tree: TreeContextProps,
  keyboardBindings: Required<KeyboardBindings>
) => {
  const getItemTitle = (index: TreeItemIndex) =>
    environment.getItemTitle(environment.items[index]);

  return descriptor.replace(/({[^\s}]+)}/g, variableNameWithBrackets => {
    const variableName = variableNameWithBrackets.slice(1, -1);
    switch (variableName) {
      case 'treeLabel':
        return tree.treeLabel ?? '';
      case 'renamingItem':
        return tree.renamingItem ? getItemTitle(tree.renamingItem) : 'None';
      case 'dragItems':
        return (
          dnd.draggingItems
            ?.map(item => environment.getItemTitle(item))
            .join(', ') ?? 'None'
        );
      case 'dropTarget': {
        if (!dnd.draggingPosition) {
          return 'None';
        }
        if (
          dnd.draggingPosition.targetType === 'item' ||
          dnd.draggingPosition.targetType === 'root'
        ) {
          return `within ${getItemTitle(dnd.draggingPosition.targetItem)}`;
        }
        const parentItem = environment.items[dnd.draggingPosition.parentItem];
        const parentTitle = environment.getItemTitle(parentItem);

        if (dnd.draggingPosition.childIndex === 0) {
          return `within ${parentTitle} at the start`;
        }
        return `within ${parentTitle} after ${getItemTitle(
          parentItem.children![dnd.draggingPosition.childIndex - 1]
        )}`;
      }

      default:
        if (variableName.startsWith('keybinding:')) {
          return keyboardBindings[
            variableName.slice(11) as keyof KeyboardBindings
          ]![0];
        }
        throw Error(`Unknown live descriptor variable {${variableName}}`);
    }
  });
};
