import * as React from 'react';
import { HTMLProps } from 'react';
import { useTree } from './Tree';
import { useDragAndDrop } from '../drag/DragAndDropProvider';

export const DragBetweenLine: React.FC<{
  treeId: string;
}> = ({ treeId }) => {
  const { draggingPosition, itemHeight } = useDragAndDrop();
  const { renderers } = useTree();

  const shouldDisplay =
    draggingPosition &&
    draggingPosition.targetType === 'between-items' &&
    draggingPosition.treeId === treeId;

  if (!shouldDisplay) {
    return null;
  }

  const lineProps: HTMLProps<any> = {
    onDragOver: e => e.preventDefault(), // Allow dropping
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        right: '0',
        top: `${(draggingPosition?.linearIndex ?? 0) * itemHeight}px`,
      }}
    >
      {renderers.renderDragBetweenLine({
        draggingPosition: draggingPosition!,
        lineProps,
      })}
    </div>
  );
};
