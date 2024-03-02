import { Ref, useImperativeHandle } from 'react';
import { TreeChangeActions, TreeRef } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useDragAndDrop } from '../drag/DragAndDropProvider';
import { useTree } from '../tree/Tree';

export const useCreatedTreeRef = (
  ref: Ref<TreeRef>,
  actions: TreeChangeActions
) => {
  const environment = useTreeEnvironment();
  const tree = useTree();
  const dnd = useDragAndDrop();

  useImperativeHandle(ref, () => ({
    ...actions,
    treeEnvironmentContext: environment,
    dragAndDropContext: dnd,
    treeContext: tree,
    ...tree.treeInformation,
  }));
};
