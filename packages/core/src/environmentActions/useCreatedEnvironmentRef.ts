import { Ref, useImperativeHandle } from 'react';
import { TreeEnvironmentChangeActions, TreeEnvironmentRef } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useDragAndDrop } from '../drag/DragAndDropProvider';

export const useCreatedEnvironmentRef = (
  ref: Ref<TreeEnvironmentRef>,
  actions: TreeEnvironmentChangeActions
) => {
  const environment = useTreeEnvironment();
  const dnd = useDragAndDrop();

  useImperativeHandle(ref, () => ({
    ...actions,
    ...environment,
    treeEnvironmentContext: environment,
    dragAndDropContext: dnd,
  }));
};
