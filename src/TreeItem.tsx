import { TreeItemIndex, TreeItemPath, TreeProps } from './types';
import { Draggable } from 'react-beautiful-dnd';
import React from 'react';

export const TreeItem = <T extends any>(props: {
  itemId: TreeItemIndex;
  indexOffset: number;
  depth: number;
  path: TreeItemPath;
}) => {


  return (
    <Draggable draggableId={props.path.join('____'/*TODO*/)} index={props.indexOffset}>
      {(provided, snapshot, rubric) => (
        <div>asd</div>
      )}
    </Draggable>
  )
}