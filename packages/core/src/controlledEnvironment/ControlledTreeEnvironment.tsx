import * as React from 'react';
import { useContext, useEffect } from 'react';
import {
  ControlledTreeEnvironmentProps,
  TreeEnvironmentContextProps,
  TreeEnvironmentRef,
} from '../types';
import { InteractionManagerProvider } from './InteractionManagerProvider';
import { DragAndDropProvider } from '../drag/DragAndDropProvider';
import { EnvironmentActionsProvider } from '../environmentActions/EnvironmentActionsProvider';
import { useControlledTreeEnvironmentProps } from './useControlledTreeEnvironmentProps';

const TreeEnvironmentContext = React.createContext<TreeEnvironmentContextProps>(
  null as any
);
export const useTreeEnvironment = () => useContext(TreeEnvironmentContext);

export const ControlledTreeEnvironment = React.forwardRef<
  TreeEnvironmentRef,
  ControlledTreeEnvironmentProps
>((props, ref) => {
  const environmentContextProps = useControlledTreeEnvironmentProps(props);

  const { viewState, onFocusItem } = props;

  // Make sure that every tree view state has a focused item
  useEffect(() => {
    for (const treeId of Object.keys(environmentContextProps.trees)) {
      const firstItemIndex =
        props.items[environmentContextProps.trees[treeId].rootItem]
          ?.children?.[0];
      const firstItem = firstItemIndex && props.items[firstItemIndex];
      if (
        !viewState[treeId]?.focusedItem &&
        environmentContextProps.trees[treeId] &&
        firstItem
      ) {
        onFocusItem?.(firstItem, treeId, false);
      }
    }
  }, [environmentContextProps.trees, onFocusItem, props.items, viewState]);

  return (
    <TreeEnvironmentContext.Provider value={environmentContextProps}>
      <InteractionManagerProvider>
        <DragAndDropProvider>
          <EnvironmentActionsProvider ref={ref}>
            {props.children}
          </EnvironmentActionsProvider>
        </DragAndDropProvider>
      </InteractionManagerProvider>
    </TreeEnvironmentContext.Provider>
  );
}) as <T = any, C extends string = never>(
  p: ControlledTreeEnvironmentProps<T, C> & {
    ref?: React.Ref<TreeEnvironmentRef<T, C>>;
  }
) => React.ReactElement;
