import { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { longTree } from 'demodata';
import { Tree } from '../tree/Tree';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItemIndex } from '../types';

export default {
  title: 'Core/Issue Report Reproduction',
} as Meta;

export const Issue363 = () => {
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);
  return (
    <ControlledTreeEnvironment<string>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      items={longTree.items}
      getItemTitle={item => item.data}
      onFocusItem={item => {
        setFocusedItem(item.index);
        console.log(`Focused item: ${item.index}`);
      }}
      onSelectItems={items => {
        setSelectedItems(items);
      }}
      onExpandItem={item => {
        setExpandedItems([...expandedItems, item.index]);
      }}
      onCollapseItem={item => {
        setExpandedItems(expandedItems.filter(i => i !== item.index));
      }}
      viewState={{
        'tree-1': {
          focusedItem,
          expandedItems,
          selectedItems,
        },
      }}
    >
      <button type="button">Focusable element</button>
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
      <pre>
        {JSON.stringify(
          {
            focusedItem,
            expandedItems,
            selectedItems,
          },
          null,
          2
        )}
      </pre>
    </ControlledTreeEnvironment>
  );
};
