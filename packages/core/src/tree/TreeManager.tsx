import * as React from 'react';
import { HTMLProps, useRef } from 'react';
import { TreeItemChildren } from '../treeItem/TreeItemChildren';
import { DragBetweenLine } from './DragBetweenLine';
import { useFocusWithin } from './useFocusWithin';
import { useTreeKeyboardBindings } from './useTreeKeyboardBindings';
import { SearchInput } from '../search/SearchInput';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { useDragAndDrop } from '../drag/DragAndDropProvider';
import { MaybeLiveDescription } from './MaybeLiveDescription';

export const TreeManager = (): JSX.Element => {
  const { treeId, rootItem, renderers, treeInformation } = useTree();
  const environment = useTreeEnvironment();
  const containerRef = useRef<HTMLElement>();
  const dnd = useDragAndDrop();

  useTreeKeyboardBindings();

  useFocusWithin(
    containerRef.current,
    () => {
      environment.setActiveTree(treeId);
    },
    () => {
      environment.setActiveTree(oldTreeId =>
        oldTreeId === treeId ? undefined : oldTreeId
      );
    }
  );

  const rootChildren = environment.items[rootItem].children;

  const treeChildren = (
    <>
      <MaybeLiveDescription />
      <TreeItemChildren depth={0} parentId={rootItem}>
        {rootChildren ?? []}
      </TreeItemChildren>
      <DragBetweenLine treeId={treeId} />
      <SearchInput containerRef={containerRef.current} />
    </>
  );

  const containerProps: HTMLProps<any> = {
    onDragOver: e => {
      e.preventDefault(); // Allow drop. Also implicitly set by items, but needed here as well for dropping on empty space
      dnd.onDragOverTreeHandler(e as any, treeId, containerRef);
    },
    onDragLeave: e => {
      dnd.onDragLeaveContainerHandler(e as any, containerRef);
    },
    onMouseDown: () => dnd.abortProgrammaticDrag(),
    ref: containerRef,
    style: { position: 'relative' },
    role: 'tree',
    'aria-label': !treeInformation.treeLabelledBy
      ? treeInformation.treeLabel
      : undefined,
    'aria-labelledby': treeInformation.treeLabelledBy,
    ...({
      'data-rct-tree': treeId,
    } as any),
  };

  return renderers.renderTreeContainer({
    children: treeChildren,
    info: treeInformation,
    containerProps,
  }) as JSX.Element;
};
