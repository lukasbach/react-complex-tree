import * as React from 'react';
import { TreeItemChildren } from '../treeItem/TreeItemChildren';
import { DragBetweenLine } from './DragBetweenLine';
import { HTMLProps, useRef } from 'react';
import { useFocusWithin } from './useFocusWithin';
import { useTreeKeyboardBindings } from './useTreeKeyboardBindings';
import { SearchInput } from '../search/SearchInput';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';

export const TreeManager = (): JSX.Element => {
  const { treeId, rootItem, renderers, treeInformation } = useTree();
  const environment = useTreeEnvironment();
  const containerRef = useRef<HTMLElement>();
  const dnd = useDragAndDrop();
  const isActiveTree = environment.activeTreeId === treeId;

  useTreeKeyboardBindings();

  useFocusWithin(
    containerRef.current,
    () => {
      environment.setActiveTree(treeId);
    },
    () => {
      environment.setActiveTree(oldTreeId => {
        return oldTreeId === treeId ? undefined : oldTreeId;
      });
    },
    [environment.activeTreeId, treeId, isActiveTree]
  );

  const rootChildren = environment.items[rootItem].children;

  if (!rootChildren) {
    throw Error(`Root ${rootItem} does not contain any children`);
  }

  const treeChildren = (
    <React.Fragment>
      <TreeItemChildren depth={0} parentId={treeId}>
        {rootChildren}
      </TreeItemChildren>
      <DragBetweenLine treeId={treeId} />
      <SearchInput containerRef={containerRef.current} />
    </React.Fragment>
  );

  const containerProps: HTMLProps<any> = {
    // onDragOver: createOnDragOverHandler(environment, containerRef, lastHoverCode, getLinearItems, rootItem, treeId),
    onDragOver: e => dnd.onDragOverTreeHandler(e as any, treeId, containerRef),
    onMouseDown: () => dnd.abortProgrammaticDrag(),
    ref: containerRef,
    style: { position: 'relative' },
    role: 'tree',
    'aria-label': !treeInformation.treeLabelledBy ? treeInformation.treeLabel : undefined,
    'aria-labelledby': treeInformation.treeLabelledBy,
    ...({
      ['data-rct-tree']: treeId,
    } as any),
  };

  return renderers.renderTreeContainer({
    children: treeChildren,
    info: treeInformation,
    containerProps,
  }) as JSX.Element;
};
