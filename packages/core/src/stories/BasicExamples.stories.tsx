import { Meta } from '@storybook/react';
import { useState } from 'react';
import * as React from 'react';
import { longTree, shortTree } from 'demodata';
import { action } from '@storybook/addon-actions';
import { Tree } from '../tree/Tree';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { buildTestTree } from '../../test/helpers';
import { TreeItemIndex } from '../types';
import { createDefaultRenderers } from '../renderers';

export default {
  title: 'Core/Basic Examples',
} as Meta;

export const SingleTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
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

export const DarkMode = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
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
    <div
      className="rct-dark"
      style={{ backgroundColor: '#222', color: '#e3e3e3' }}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </div>
  </UncontrolledTreeEnvironment>
);

export const PredefinedViewState = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {
        expandedItems: ['Fruit'],
        focusedItem: 'Apple',
        selectedItems: ['Apple', 'Lemon', 'Berries'],
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const Actions = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
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
    onStartRenamingItem={action('onStartRenamingItem')}
    onRenameItem={action('onRenameItem')}
    onAbortRenamingItem={action('onAbortRenamingItem')}
    onCollapseItem={action('onCollapseItem')}
    onExpandItem={action('onExpandItem')}
    onSelectItems={action('onSelectItems')}
    onFocusItem={action('onFocusItem')}
    onDrop={action('onDrop')}
    onPrimaryAction={action('onPrimaryAction')}
    onRegisterTree={action('onRegisterTree')}
    onUnregisterTree={action('onUnregisterTree')}
    onMissingItems={action('onMissingItems')}
    onMissingChildren={action('onMissingChildren')}
  >
    <>
      <p>
        In this example, action hooks trigger Storybook actions in the
        &quot;Actions&quot; tab below.
      </p>
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </>
  </UncontrolledTreeEnvironment>
);

export const SingleTreeAllCollapsed = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {},
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const SmallTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(shortTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {},
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const MultipleTrees = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {},
    }}
  >
    <div
      style={{
        display: 'flex',
        backgroundColor: '#D8DEE9',
        justifyContent: 'space-evenly',
        alignItems: 'baseline',
        padding: '20px 0',
      }}
    >
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree 1" />
      </div>
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-2" rootItem="root" treeLabel="Tree 2" />
      </div>
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-3" rootItem="root" treeLabel="Tree 3" />
      </div>
    </div>
  </UncontrolledTreeEnvironment>
);

export const MultipleTrees2 = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {
        expandedItems: ['Meals', 'Europe'],
        selectedItems: ['Risotto', 'Pizza', 'Weisswurst', 'Spargel'],
        focusedItem: 'Spargel',
      },
      'tree-2': {
        expandedItems: ['Fruit', 'Berries'],
        selectedItems: ['Orange'],
        focusedItem: 'Orange',
      },
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          width: '44%',
          backgroundColor: '#fff',
          color: '#000',
          borderRadius: '12px',
          paddingRight: '6px',
        }}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree 1" />
      </div>
      <div
        className="rct-dark"
        style={{
          width: '44%',
          backgroundColor: '#222',
          color: '#e3e3e3',
          borderRadius: '12px',
          paddingRight: '6px',
        }}
      >
        <Tree treeId="tree-2" rootItem="root" treeLabel="Tree 2" />
      </div>
    </div>
  </UncontrolledTreeEnvironment>
);

export const DropOnEmptyTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(
        {
          ...longTree.items,
          empty: {
            data: 'Empty Folder',
            index: 'empty',
            isFolder: true,
          },
        },
        (item, data) => ({
          ...item,
          data,
        })
      )
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {},
    }}
    renderTreeContainer={({ children, containerProps, info }) => (
      <div
        className={[
          'rct-tree-root',
          info.isFocused && 'rct-tree-root-focus',
          info.isRenaming && 'rct-tree-root-renaming',
          info.areItemsSelected && 'rct-tree-root-itemsselected',
        ].join(' ')}
      >
        <div
          {...containerProps}
          style={{ minHeight: '400px', ...containerProps.style }}
        >
          {children}
        </div>
      </div>
    )}
  >
    <div
      style={{
        display: 'flex',
        backgroundColor: '#D8DEE9',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: '20px 0',
      }}
    >
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree 1" />
      </div>
      <div
        style={{
          width: '28%',
          backgroundColor: 'white',
        }}
      >
        <Tree treeId="tree-2" rootItem="empty" treeLabel="Tree 2" />
      </div>
    </div>
  </UncontrolledTreeEnvironment>
);

export const SwitchMountedTree = () => {
  const [showFirstTree, setShowFirstTree] = useState(false);
  return (
    <UncontrolledTreeEnvironment<string>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={
        new StaticTreeDataProvider(longTree.items, (item, data) => ({
          ...item,
          data,
        }))
      }
      getItemTitle={item => item.data}
      viewState={{}}
    >
      <button onClick={() => setShowFirstTree(!showFirstTree)} type="button">
        Switch Tree
      </button>
      {showFirstTree ? (
        <Tree treeId="tree-1" rootItem="Europe" treeLabel="Tree Example" />
      ) : (
        <Tree treeId="tree-2" rootItem="America" treeLabel="Tree Example" />
      )}
    </UncontrolledTreeEnvironment>
  );
};

export const TreeItemContextRenaming = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{}}
    renderItem={({ item, depth, children, title, context, arrow }) => {
      const InteractiveComponent = context.isRenaming ? 'div' : 'button';
      const type = context.isRenaming ? undefined : 'button';
      return (
        <li
          {...(context.itemContainerWithChildrenProps as any)}
          className="rct-tree-item-li"
        >
          <div
            {...(context.itemContainerWithoutChildrenProps as any)}
            style={{ paddingLeft: `${(depth + 1) * 4}px` }}
            className={[
              'rct-tree-item-title-container',
              item.isFolder && 'rct-tree-item-title-container-isFolder',
              context.isSelected && 'rct-tree-item-title-container-selected',
              context.isExpanded && 'rct-tree-item-title-container-expanded',
              context.isFocused && 'rct-tree-item-title-container-focused',
              context.isDraggingOver &&
                'rct-tree-item-title-container-dragging-over',
              context.isSearchMatching &&
                'rct-tree-item-title-container-search-match',
            ].join(' ')}
          >
            {arrow}
            <InteractiveComponent
              type={type}
              {...(context.interactiveElementProps as any)}
              className="rct-tree-item-button"
            >
              {title}
            </InteractiveComponent>
            <button onClick={context.startRenamingItem} type="button">
              Rename
            </button>
          </div>
          {children}
        </li>
      );
    }}
  >
    <Tree treeId="tree-1" rootItem="Europe" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const UnitTestTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(buildTestTree(), (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{}}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const UnitTestTreeOpen = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(buildTestTree(), (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
    viewState={{
      'tree-1': {
        expandedItems: Object.keys(buildTestTree()),
      },
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const ReparentTestTree = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(buildTestTree(), (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => `${item.data}`}
    viewState={{ 'tree-1': { expandedItems: ['a', 'ad'] } }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const DisableMultiselect = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    disableMultiselect
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
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

export const NavigateAway = () => {
  const [navigatedAway, setNavigatedAway] = useState(false);

  if (navigatedAway) return <div>Navigated away!</div>;

  return (
    <UncontrolledTreeEnvironment<string>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={
        new StaticTreeDataProvider(longTree.items, (item, data) => ({
          ...item,
          data,
        }))
      }
      getItemTitle={item => item.data}
      onSelectItems={() => {
        setNavigatedAway(true);
      }}
      viewState={{
        'tree-1': {
          expandedItems: [],
        },
      }}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
};

export const AnimatedExpandingAndCollapsing = () => {
  const [openingItem, setOpeningItem] = useState<TreeItemIndex | undefined>();
  const [closingItem, setClosingItem] = useState<TreeItemIndex | undefined>();
  return (
    <UncontrolledTreeEnvironment<string>
      dataProvider={
        new StaticTreeDataProvider(longTree.items, (item, data) => ({
          ...item,
          data,
        }))
      }
      getItemTitle={item => item.data}
      shouldRenderChildren={(item, context) =>
        context.isExpanded ||
        closingItem === item.index ||
        openingItem === item.index
      }
      onExpandItem={item => {
        setOpeningItem(item.index);
        setTimeout(() => {
          setOpeningItem(undefined);
        });
      }}
      onCollapseItem={item => {
        setClosingItem(item.index);
        setTimeout(() => {
          setClosingItem(undefined);
        }, 500);
      }}
      viewState={{
        'tree-1': {},
      }}
      renderItemsContainer={({ children, containerProps, parentId }) => (
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <ul
            {...containerProps}
            className="rct-tree-items-container"
            style={{
              transition: 'all 500ms',
              maxHeight:
                parentId === openingItem || parentId === closingItem
                  ? 0
                  : '999999px',
              marginTop:
                parentId === closingItem || parentId === openingItem
                  ? '-100%'
                  : '0',
            }}
          >
            {children}
          </ul>
        </div>
      )}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
};

export const RightToLeftRenderers = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
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
    {...createDefaultRenderers(10, true)}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const ItemContainersWithMargin = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
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
    <style>
      {
        '.rct-tree-item-title-container { margin-top: 10px; margin-bottom: 20px;}'
      }
    </style>
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const HotkeysDisabled = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    keyboardBindings={{
      primaryAction: [],
      moveFocusToFirstItem: [],
      moveFocusToLastItem: [],
      expandSiblings: [],
      renameItem: [],
      abortRenameItem: [],
      toggleSelectItem: [],
      abortSearch: [],
      startSearch: [],
      selectAll: [],
      startProgrammaticDnd: [],
      abortProgrammaticDnd: [],
      completeProgrammaticDnd: [],
    }}
    dataProvider={
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={item => item.data}
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
