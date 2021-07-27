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

  if (!(env.liveDescriptors ?? true)) {
    return null;
  }

  const descriptors = useMemo(() => env.liveDescriptors ?? defaultLiveDescriptors, []);

  const MainWrapper = useMemo<React.FC>(() => props => (
    <div
      id={`rct-livedescription-${tree.treeId}`}
      style={{ // TODO
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '250px',
        fontSize: '10px',
        backgroundColor: 'rgba(255, 255, 255, .5)'
      }}
    >
      {props.children}
    </div>
  ), []);

  const LiveWrapper = useMemo(() => ({ children, live }: { children: string, live: 'off' | 'assertive' | 'polite' }) => (
    <div
      aria-live={live}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  ), []);

  if (tree.treeInformation.isRenaming) {
    return (
      <MainWrapper>
        <LiveWrapper live="polite">
          {resolveLiveDescriptor(descriptors.renamingItem, env, dnd, tree)}
        </LiveWrapper>
      </MainWrapper>
    );
  } else if (tree.treeInformation.isSearching) {
    return (
      <MainWrapper>
        <LiveWrapper live="polite">
          {resolveLiveDescriptor(descriptors.searching, env, dnd, tree)}
        </LiveWrapper>
      </MainWrapper>
    );
  } else if (tree.treeInformation.isProgrammaticallyDragging) {
    return (
      <MainWrapper>
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
      <MainWrapper>
        <LiveWrapper live="off">
          {resolveLiveDescriptor(descriptors.introduction, env, dnd, tree)}
        </LiveWrapper>
      </MainWrapper>
    );
  }
};
