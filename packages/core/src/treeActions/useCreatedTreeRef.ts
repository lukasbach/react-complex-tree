import { Ref, useEffect, useImperativeHandle, useMemo } from 'react';
import { LinearItem, TreeChangeActions, TreeRef } from '../types';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { useTree } from '../tree/Tree';
import { EventEmitter } from '../EventEmitter';

export const useCreatedTreeRef = (
  ref: Ref<TreeRef>,
  actions: TreeChangeActions
) => {
  const environment = useTreeEnvironment();
  const tree = useTree();
  const dnd = useDragAndDrop();

  const linearList = environment.linearItems[tree.treeId];
  const onChangeLinearList = useMemo(
    () => new EventEmitter<LinearItem[]>(),
    []
  );
  useEffect(() => {
    onChangeLinearList.emit(linearList);
  }, [linearList, onChangeLinearList]);

  useImperativeHandle(ref, () => ({
    ...actions,
    treeEnvironmentContext: environment,
    dragAndDropContext: dnd,
    treeContext: tree,
    linearList,
    onChangeLinearList,
    ...tree.treeInformation,
  }));
};
