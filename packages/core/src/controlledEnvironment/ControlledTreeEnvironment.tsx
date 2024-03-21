import * as React from 'react';
import { useContext } from 'react';
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

  const { viewState } = props;

  // Make sure that every tree view state has a focused item
  for (const treeId of Object.keys(environmentContextProps.trees)) {
    // TODO if the focus item is dragged out of the tree and is not within the expanded items
    // TODO of that tree, the tree does not show any focus item anymore.
    // Fix: use linear items to see if focus item is visible, and reset if not. Only refresh that
    // information when the viewstate changes
    if (
      !viewState[treeId]?.focusedItem &&
      environmentContextProps.trees[treeId]
    ) {
      viewState[treeId] = {
        ...viewState[treeId],
        focusedItem:
          props.items[environmentContextProps.trees[treeId].rootItem]
            ?.children?.[0],
      };
    }
  }

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
