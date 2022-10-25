import { Meta } from '@storybook/react';
import React from 'react';
import { longTree } from 'demodata';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';

export default {
  title: 'Core/Search Configurability',
} as Meta;

export const SearchByStartTyping = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    canSearchByStartingTyping
    viewState={{
      'tree-1': {
        expandedItems: [
          'Fruit',
          'Meals',
          'America',
          'Europe',
          'Asia',
          'Desserts',
        ],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const SearchOnlyWithHotkey = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    canSearchByStartingTyping={false}
    keyboardBindings={{
      startSearch: ['f1'],
      // TODO hotkeys do not overwrite browser default because preventDefault is called on keyup, not keydown
      // TODO fix by checking whether hotkey is already fulfilled during keydown
    }}
    viewState={{
      'tree-1': {
        expandedItems: [
          'Fruit',
          'Meals',
          'America',
          'Europe',
          'Asia',
          'Desserts',
        ],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const NoSearch = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    canSearch={false}
    viewState={{
      'tree-1': {
        expandedItems: [
          'Fruit',
          'Meals',
          'America',
          'Europe',
          'Asia',
          'Desserts',
        ],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const CustomSearchEvaluation = () => (
  <>
    <p>
      In the following example, the search evaluates only the children of an
      item, not the items title itself. This means that searching for
      &quot;Orange&quot; will match its parent &quot;Fruit&quot;.
    </p>
    <UncontrolledTreeEnvironment<string>
      dataProvider={new StaticTreeDataProvider(longTree.items)}
      getItemTitle={item => item.data}
      doesSearchMatchItem={(search, item) =>
        !!item.children?.join(' ').toLowerCase().includes(search.toLowerCase())
      }
      renderItemTitle={props =>
        props.info.isSearching && props.context.isSearchMatching ? (
          <span className="rct-tree-item-search-highlight">{props.title}</span>
        ) : (
          props.title
        )
      }
      viewState={{
        'tree-1': {
          expandedItems: [
            'Fruit',
            'Meals',
            'America',
            'Europe',
            'Asia',
            'Desserts',
          ],
        },
      }}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  </>
);
