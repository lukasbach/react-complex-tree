import * as React from 'react';
import { HTMLProps, useContext } from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useTree } from './Tree';

export const DragBetweenLine: React.FC<{
  treeId: string,
}> = props => {
  const { draggingPosition, itemHeight } = useTreeEnvironment();
  const { renderers } = useTree();

  const shouldDisplay =
    draggingPosition &&
    draggingPosition.targetType === 'between-items' &&
    draggingPosition.treeId === props.treeId;


  if (!shouldDisplay) {
    return null;
  }

  const lineProps: HTMLProps<any> = {
    onDragOver: e => e.preventDefault(), // Allow dropping
  }

  return (
    <div style={{
      position: 'absolute',
      left: '0',
      right: '0',
      top: `${((draggingPosition?.linearIndex ?? 0)) * itemHeight}px`
    }}>
      {renderers.renderDragBetweenLine(draggingPosition!, lineProps)}
    </div>
  );
};
