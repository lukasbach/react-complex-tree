import * as React from 'react';
import { InteractionManager, InteractionMode } from '../types';
import { useMemo } from 'react';
import { ClickItemToExpandInteractionManager } from '../interactionMode/ClickItemToExpandInteractionManager';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { DoubleClickItemToExpandInteractionManager } from '../interactionMode/DoubleClickItemToExpandInteractionManager';
import { ClickArrowToExpandInteractionManager } from '../interactionMode/ClickArrowToExpandInteractionManager';

const InteractionManagerContext = React.createContext<InteractionManager>(null as any);
export const useInteractionManager = () => React.useContext(InteractionManagerContext);

export const InteractionManagerProvider: React.FC = props => {
  const environment = useTreeEnvironment();

  const interactionManager = useMemo(() => {
    if (environment.defaultInteractionMode && typeof environment.defaultInteractionMode !== 'string') {
      return environment.defaultInteractionMode;
    }

    switch (environment.defaultInteractionMode ?? InteractionMode.ClickItemToExpand) {
      case InteractionMode.DoubleClickItemToExpand:
        return new DoubleClickItemToExpandInteractionManager(environment);
      case InteractionMode.ClickItemToExpand:
        return new ClickItemToExpandInteractionManager(environment);
      case InteractionMode.ClickArrowToExpand:
        return new ClickArrowToExpandInteractionManager(environment);
      default:
        throw Error(`Unknown interaction mode ${environment.defaultInteractionMode}`);
    }
  }, []); // TODO make sure that environment does not need to be refreshed

  return (
    <InteractionManagerContext.Provider value={interactionManager}>{props.children}</InteractionManagerContext.Provider>
  );
};
