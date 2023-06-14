import { useMemo } from 'react';
import { AllTreeRenderProps, TreeRenderProps } from '../types';
import { createDefaultRenderers } from './createDefaultRenderers';

export const useRenderers = ({
  renderItem,
  renderItemTitle,
  renderItemArrow,
  renderRenameInput,
  renderItemsContainer,
  renderTreeContainer,
  renderDragBetweenLine,
  renderSearchInput,
  renderLiveDescriptorContainer,
  renderDepthOffset,
}: TreeRenderProps) => {
  const defaultRenderers = useMemo(
    () => createDefaultRenderers(renderDepthOffset ?? 10),
    [renderDepthOffset]
  );

  const customRenderers: TreeRenderProps = {
    renderItem,
    renderItemTitle,
    renderItemArrow,
    renderRenameInput,
    renderItemsContainer,
    renderTreeContainer,
    renderDragBetweenLine,
    renderSearchInput,
    renderLiveDescriptorContainer,
    renderDepthOffset,
  };

  const renderers = Object.entries(defaultRenderers).reduce<AllTreeRenderProps>(
    (acc, [key, value]) => {
      const keyMapped = key as keyof AllTreeRenderProps;
      if (customRenderers[keyMapped]) {
        acc[keyMapped] = customRenderers[keyMapped] as any;
      } else {
        acc[keyMapped] = value as any;
      }
      return acc;
    },
    {} as AllTreeRenderProps
  );

  (renderers.renderItem as any).displayName = 'RenderItem';
  (renderers.renderItemTitle as any).displayName = 'RenderItemTitle';
  (renderers.renderItemArrow as any).displayName = 'RenderItemArrow';
  (renderers.renderRenameInput as any).displayName = 'RenderRenameInput';
  (renderers.renderItemsContainer as any).displayName = 'RenderItemsContainer';
  (renderers.renderTreeContainer as any).displayName = 'RenderTreeContainer';
  (renderers.renderDragBetweenLine as any).displayName =
    'RenderDragBetweenLine';
  (renderers.renderSearchInput as any).displayName = 'RenderSearchInput';

  return renderers;
};
