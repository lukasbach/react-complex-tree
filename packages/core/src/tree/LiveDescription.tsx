import * as React from 'react';
import { useMemo } from 'react';
import { useTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { defaultLiveDescriptors } from './defaultLiveDescriptors';
import { useTree } from './Tree';
import { useDragAndDrop } from '../controlledEnvironment/DragAndDropProvider';
import { resolveLiveDescriptor } from './resolveLiveDescriptor';
import { useKeyboardBindings } from '../hotkeys/useKeyboardBindings';

export const LiveDescription: React.FC = () => {
  const env = useTreeEnvironment();
  const tree = useTree();
  const dnd = useDragAndDrop();
  const keys = useKeyboardBindings();

  const descriptors = useMemo(
    () => env.liveDescriptors ?? defaultLiveDescriptors,
    [env.liveDescriptors]
  );

  const LiveWrapper = useMemo(
    () =>
      ({
        children,
        live,
      }: {
        children: string;
        live: 'off' | 'assertive' | 'polite';
      }) =>
        <div aria-live={live} dangerouslySetInnerHTML={{ __html: children }} />,
    []
  );

  const MainWrapper = tree.renderers.renderLiveDescriptorContainer;

  if (tree.treeInformation.isRenaming) {
    return (
      <MainWrapper tree={tree}>
        <LiveWrapper live="polite">
          {resolveLiveDescriptor(
            descriptors.renamingItem,
            env,
            dnd,
            tree,
            keys
          )}
        </LiveWrapper>
      </MainWrapper>
    );
  }
  if (tree.treeInformation.isSearching) {
    return (
      <MainWrapper tree={tree}>
        <LiveWrapper live="polite">
          {resolveLiveDescriptor(descriptors.searching, env, dnd, tree, keys)}
        </LiveWrapper>
      </MainWrapper>
    );
  }
  if (tree.treeInformation.isProgrammaticallyDragging) {
    return (
      <MainWrapper tree={tree}>
        <LiveWrapper live="polite">
          {resolveLiveDescriptor(
            descriptors.programmaticallyDragging,
            env,
            dnd,
            tree,
            keys
          )}
        </LiveWrapper>
        <LiveWrapper live="assertive">
          {resolveLiveDescriptor(
            descriptors.programmaticallyDraggingTarget,
            env,
            dnd,
            tree,
            keys
          )}
        </LiveWrapper>
      </MainWrapper>
    );
  }
  return (
    <MainWrapper tree={tree}>
      <LiveWrapper live="off">
        {resolveLiveDescriptor(descriptors.introduction, env, dnd, tree, keys)}
      </LiveWrapper>
    </MainWrapper>
  );
};
