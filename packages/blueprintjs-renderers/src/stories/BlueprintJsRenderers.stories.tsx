import { Meta } from '@storybook/react';
import React from 'react';
import { StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment } from 'react-complex-tree';
import { longTree } from 'demodata';
import { renderers } from '../renderers';
import { FocusStyleManager } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

// import '@blueprintjs/core/lib/css/blueprint.css';

export default {
  title: 'BlueprintJs Renderers/BlueprintJs Renderers',
  decorators: [
    Story => (
      <>
        <link href="https://unpkg.com/normalize.css@^8.0.1" rel="stylesheet" />
        <link href="https://unpkg.com/@blueprintjs/core@^4.0.0-alpha.0/lib/css/blueprint.css" rel="stylesheet" />
        <Story />
      </>
    )
  ]
} as Meta;

export const BlueprintJsTree = () => (
  <div onMouseDown={() => FocusStyleManager.onlyShowFocusOnTabs()} onKeyDown={() => FocusStyleManager.alwaysShowFocus()}>
    <UncontrolledTreeEnvironment<string>
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
      {...renderers}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  </div>
);