import { DraggingPosition } from '../types';
import * as React from 'react';
import { TreeItemChildren } from '../treeItem/TreeItemChildren';
import { DragBetweenLine } from './DragBetweenLine';
import { HTMLProps, useContext, useMemo, useRef } from 'react';
import { useFocusWithin } from './useFocusWithin';
import { useGetLinearItems } from './useGetLinearItems';
import { useTreeKeyboardBindings } from './useTreeKeyboardBindings';
import { SearchInput } from '../search/SearchInput';
import { useTree } from './Tree';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { createOnDragOverHandler } from './createOnDragOverHandler';

export const TreeManager = <T extends any>(props: {}): JSX.Element => {
  const { treeId, rootItem, renderers, treeInformation } = useTree();
  const environment = useTreeEnvironment();
  const containerRef = useRef<HTMLElement>();
  const lastHoverCode = useRef<string>();
  const getLinearItems = useGetLinearItems();
  const isActiveTree = environment.activeTreeId === treeId;

  useTreeKeyboardBindings(containerRef.current);

  useFocusWithin(containerRef.current, () => {
    environment.setActiveTree(treeId);
    console.log(`focus in for ${treeId}, previous was ${environment.activeTreeId}`, document.activeElement)
  }, () => {
    if (isActiveTree) {
      console.log(`Focusout, is active tree: ${isActiveTree?1:0}, ${environment.activeTreeId} for tree ${treeId}`, document.activeElement)
      environment.setActiveTree(undefined);
    }
  }, [environment.activeTreeId, treeId, isActiveTree]);

  const rootChildren = environment.items[rootItem].children;

  if (!rootChildren) {
    throw Error(`Root ${rootItem} does not contain any children`);
  }

  const treeChildren = (
    <React.Fragment>
      <TreeItemChildren children={rootChildren} depth={0} parentId={treeId} />
      <DragBetweenLine treeId={treeId} />
      <SearchInput containerRef={containerRef.current} />
    </React.Fragment>
  );

  const containerProps: HTMLProps<any> = {
    onDragOver: createOnDragOverHandler(environment, containerRef, lastHoverCode, getLinearItems, rootItem, treeId),
    ref: containerRef,
    style: { position: 'relative' },
    role: 'tree',
    'aria-label': !treeInformation.treeLabelledBy ? treeInformation.treeLabel : undefined,
    'aria-labelledby': treeInformation.treeLabelledBy,
    ...({
      ['data-rct-tree']: treeId,
    } as any)
  };

  return renderers.renderTreeContainer(treeChildren, containerProps, treeInformation) as JSX.Element;
}