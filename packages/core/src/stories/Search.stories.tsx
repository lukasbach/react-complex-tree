import { Meta } from '@storybook/react';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';
import React from 'react';
import { longTree } from 'demodata';

export default {
  title: 'Core/Search Configurability',
} as Meta;

export const SearchOnlyWithHotkey = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    canSearchByStartingTyping={false}
    keyboardBindings={{
      startSearch: ['f1']
      // TODO hotkeys do not overwrite browser default because preventDefault is called on keyup, not keydown
      // TODO fix by checking whether hotkey is already fulfilled during keydown
    }}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);