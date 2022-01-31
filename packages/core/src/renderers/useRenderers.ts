import { TreeRenderProps } from '../types';
import { useMemo } from 'react';
import { createDefaultRenderers } from './createDefaultRenderers';

export const useRenderers = ({
  renderItem,
  renderItemTitle,
  renderItemArrow,
  renderRenameInput,
  renderDraggingItem,
  renderDraggingItemTitle,
  renderItemsContainer,
  renderTreeContainer,
  renderDragBetweenLine,
  renderSearchInput,
  renderLiveDescriptorContainer,
  renderDepthOffset,
}: TreeRenderProps) => {
  const defaultRenderers = useMemo(() => createDefaultRenderers(renderDepthOffset ?? 10), [renderDepthOffset]);

  const renderers = {
    ...defaultRenderers,
    renderItem,
    renderItemTitle,
    renderItemArrow,
    renderRenameInput,
    renderDraggingItem,
    renderDraggingItemTitle,
    renderItemsContainer,
    renderTreeContainer,
    renderDragBetweenLine,
    renderSearchInput,
    renderLiveDescriptorContainer,
    renderDepthOffset,
  };

  (renderers.renderItem as any).displayName = 'RenderItem';
  (renderers.renderItemTitle as any).displayName = 'RenderItemTitle';
  (renderers.renderItemArrow as any).displayName = 'RenderItemArrow';
  (renderers.renderRenameInput as any).displayName = 'RenderRenameInput';
  (renderers.renderDraggingItem as any).displayName = 'RenderDraggingItem';
  (renderers.renderDraggingItemTitle as any).displayName = 'RenderDraggingItemTitle';
  (renderers.renderItemsContainer as any).displayName = 'RenderItemsContainer';
  (renderers.renderTreeContainer as any).displayName = 'RenderTreeContainer';
  (renderers.renderDragBetweenLine as any).displayName = 'RenderDragBetweenLine';
  (renderers.renderSearchInput as any).displayName = 'RenderSearchInput';

  return renderers;
};
