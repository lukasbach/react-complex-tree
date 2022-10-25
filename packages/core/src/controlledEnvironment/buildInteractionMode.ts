import { InteractionMode, TreeEnvironmentContextProps } from '../types';
import { DoubleClickItemToExpandInteractionManager } from '../interactionMode/DoubleClickItemToExpandInteractionManager';
import { ClickItemToExpandInteractionManager } from '../interactionMode/ClickItemToExpandInteractionManager';
import { ClickArrowToExpandInteractionManager } from '../interactionMode/ClickArrowToExpandInteractionManager';

export const buildInteractionMode = (
  mode: InteractionMode,
  environment: TreeEnvironmentContextProps
) => {
  switch (mode) {
    case InteractionMode.DoubleClickItemToExpand:
      return new DoubleClickItemToExpandInteractionManager(environment);
    case InteractionMode.ClickItemToExpand:
      return new ClickItemToExpandInteractionManager(environment);
    case InteractionMode.ClickArrowToExpand:
      return new ClickArrowToExpandInteractionManager(environment);
    default:
      throw Error(`Unknown interaction mode ${mode}`);
  }
};
