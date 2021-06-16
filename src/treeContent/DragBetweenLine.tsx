import * as React from 'react';
import { useContext } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeRenderContext } from './Tree';

export const DragBetweenLine: React.FC<{
  treeId: string,
}> = props => {
  const environment = useContext(TreeEnvironmentContext);
  const renderers = useContext(TreeRenderContext);

  const shouldDisplay =
    environment.draggingPosition &&
    environment.draggingPosition.treeId === props.treeId &&
    environment.draggingPosition.childIndex !== undefined &&
    environment.draggingPosition.linearIndex !== undefined;


  if (!shouldDisplay) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      left: '0',
      right: '0',
      top: `${((environment.draggingPosition?.linearIndex ?? 0)) * environment.itemHeight}px`
    }}>
      {renderers.renderDragBetweenLine(environment.draggingPosition!)}
    </div>
  );
};
