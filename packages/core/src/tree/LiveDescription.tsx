import * as React from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { defaultLiveDescriptors } from './defaultLiveDescriptors';
import { useEffect, useMemo, useState } from 'react';
import { useTree } from './Tree';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { resolveLiveDescriptor } from './resolveLiveDescriptor';

export const LiveDescription: React.FC<{}> = props => {
  const env = useTreeEnvironment();
  const tree = useTree();
  const dnd = useDragAndDrop();

  if (!(env.showLiveDescription ?? true)) {
    return null;
  }

  const descriptors = useMemo(() => env.liveDescriptors ?? defaultLiveDescriptors, []);

  const LiveWrapper = useMemo(
    () =>
      ({ children, live }: { children: string; live: 'off' | 'assertive' | 'polite' }) =>
        <div aria-live={live} dangerouslySetInnerHTML={{ __html: children }} />,
    []
  );

  const MainWrapper = tree.renderers.renderLiveDescriptorContainer;

  if (tree.treeInformation.isRenaming) {
    return (
      <MainWrapper tree={tree}>
        <LiveWrapper live="polite">{resolveLiveDescriptor(descriptors.renamingItem, env, dnd, tree)}</LiveWrapper>
      </MainWrapper>
    );
  } else if (tree.treeInformation.isSearching) {
    return (
      <MainWrapper tree={tree}>
        <LiveWrapper live="polite">{resolveLiveDescriptor(descriptors.searching, env, dnd, tree)}</LiveWrapper>
      </MainWrapper>
    );
  } else if (tree.treeInformation.isProgrammaticallyDragging) {
    return (
      <MainWrapper tree={tree}>
        <LiveWrapper live="polite">
          {resolveLiveDescriptor(descriptors.programmaticallyDragging, env, dnd, tree)}
        </LiveWrapper>
        <LiveWrapper live="assertive">
          {resolveLiveDescriptor(descriptors.programmaticallyDraggingTarget, env, dnd, tree)}
        </LiveWrapper>
      </MainWrapper>
    );
  } else {
    return (
      <MainWrapper tree={tree}>
        <LiveWrapper live="off">{resolveLiveDescriptor(descriptors.introduction, env, dnd, tree)}</LiveWrapper>
      </MainWrapper>
    );
  }
};
