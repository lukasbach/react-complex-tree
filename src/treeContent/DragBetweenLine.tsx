import * as React from 'react';
import { HTMLProps, useContext } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeRenderContext } from './Tree';

export const DragBetweenLine: React.FC<{
  treeId: string,
}> = props => {
  const environment = useContext(TreeEnvironmentContext);
  const renderers = useContext(TreeRenderContext);

  const shouldDisplay =
    environment.draggingPosition &&
    environment.draggingPosition.targetType === 'between-items' &&
    environment.draggingPosition.treeId === props.treeId;


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
      top: `${((environment.draggingPosition?.linearIndex ?? 0)) * environment.itemHeight}px`
    }}>
      {renderers.renderDragBetweenLine(environment.draggingPosition!, lineProps)}
    </div>
  );
};
