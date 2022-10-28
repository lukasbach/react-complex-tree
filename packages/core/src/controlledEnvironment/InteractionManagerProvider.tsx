import * as React from 'react';
import { useMemo } from 'react';
import { InteractionManager, InteractionMode } from '../types';
import { useTreeEnvironment } from './ControlledTreeEnvironment';
import { mergeInteractionManagers } from './mergeInteractionManagers';
import { buildInteractionMode } from './buildInteractionMode';

const InteractionManagerContext = React.createContext<InteractionManager<any>>(
  null as any
);
export const useInteractionManager = () =>
  React.useContext(InteractionManagerContext);

export const InteractionManagerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const environment = useTreeEnvironment();
  const { defaultInteractionMode } = environment;

  const interactionManager = useMemo(() => {
    if (defaultInteractionMode && typeof defaultInteractionMode !== 'string') {
      if (defaultInteractionMode.extends) {
        return mergeInteractionManagers(
          defaultInteractionMode,
          buildInteractionMode(defaultInteractionMode.extends, environment)
        );
      }
      return defaultInteractionMode;
    }

    return buildInteractionMode(
      (defaultInteractionMode as InteractionMode) ??
        InteractionMode.ClickItemToExpand,
      environment
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // TODO make sure that environment does not need to be refreshed

  return (
    <InteractionManagerContext.Provider value={interactionManager}>
      {children}
    </InteractionManagerContext.Provider>
  );
};
