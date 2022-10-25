import { InteractionManager } from '../types';

export const mergeInteractionManagers = (
  main: InteractionManager,
  fallback: InteractionManager
): InteractionManager => ({
  mode: main.mode,
  createInteractiveElementProps: (item, treeId, actions, renderFlags) => ({
    ...fallback.createInteractiveElementProps(
      item,
      treeId,
      actions,
      renderFlags
    ),
    ...main.createInteractiveElementProps(item, treeId, actions, renderFlags),
  }),
});
