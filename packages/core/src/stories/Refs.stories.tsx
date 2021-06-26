import { Meta } from '@storybook/react';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';
import React, { useEffect, useRef } from 'react';
import { longTree } from './utils/treeData.stories';
import { TreeContextProps, TreeEnvironmentContextProps } from '../types';

export default {
  title: 'React Refs',
} as Meta;

export const ControlTreeExternally = () => {
  const treeEnvironment = useRef<TreeEnvironmentContextProps>(null);
  const tree = useRef<TreeContextProps>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(treeEnvironment.current, tree.current)
      if (treeEnvironment.current && tree.current) {
        const linearItems = tree.current.getItemsLinearly();
        const currentlyActive = treeEnvironment.current.viewState[tree.current.treeId]?.focusedItem ?? linearItems[0].item;
        let nextActiveIndex = linearItems.findIndex(item => item.item === currentlyActive) + 1;

        if (nextActiveIndex > linearItems.length - 1) {
          nextActiveIndex = 0;
        }

        const nextActiveItem = linearItems[nextActiveIndex].item;

        if (treeEnvironment.current.items[nextActiveItem].hasChildren) {
          if (treeEnvironment.current.viewState[tree.current.treeId]?.expandedItems?.includes(nextActiveItem)) {
            treeEnvironment.current.onCollapseItem?.(treeEnvironment.current.items[nextActiveItem], tree.current.treeId);
          } else {
            treeEnvironment.current.onExpandItem?.(treeEnvironment.current.items[nextActiveItem], tree.current.treeId);
          }
        }

        treeEnvironment.current.onFocusItem?.(treeEnvironment.current.items[nextActiveItem], tree.current.treeId);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <UncontrolledTreeEnvironment<string>
      ref={treeEnvironment}
      allowDragAndDrop={true}
      allowDropOnItemWithChildren={true}
      allowReorderingItems={true}
      dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({...item, data}))}
      getItemTitle={item => item.data}
      viewState={{
        ['tree-1']: {
          expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
        }
      }}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" ref={tree} />
    </UncontrolledTreeEnvironment>
  );
};