import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { ExplicitDataSource, TreeInformation, TreeItem, TreeItemRenderContext, TreeRenderProps } from '../types';
import { Tree } from '../tree/Tree';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';

const demoRenderers: TreeRenderProps<string> = {
  // renderItem(item: TreeItem<string>, depth: number, context: TreeItemRenderContext, info: TreeInformation): React.ReactNode {
  //   return (
  //     <div {...context.interactiveElementProps as any} style={{ marginLeft: `${depth * 5}px` }}>
  //       {item.data}
  //     </div>
  //   );
  // },
  // renderItemTitle(item: TreeItem<string>, context: TreeItemRenderContext, info: TreeInformation): string {
  //   return item.data;
  // },
};

const shortTreeTemplate = {
  root: {
    container: {
      item0: null,
      item1: null,
      item2: null,
      item3: {
        inner0: null,
        inner1: null,
        inner2: null,
        inner3: null,
      },
      item4: null,
      item5: null
    },
  }
}

const longTreeTemplate = {
  root: {
    Fruit: {
      Apple: null,
      Orange: null,
      Lemon: null,
      Berries: {
        Strawberry: null,
        Blueberry: null,
      },
      Banana: null
    },
    Meals: {
      America: {
        SmashBurger: null,
        Chowder: null,
        Ravioli: null,
        MacAndCheese: null,
        Brownies: null,
      },
      Europe: {
        Risotto: null,
        Spaghetti: null,
        Pizza: null,
        Weisswurst: null,
        Spargel: null,
      },
      Asia: {
        Curry: null,
        PadThai: null,
        Jiaozi: null,
        Sushi: null,
      },
      Australia: {
        PotatoWedges: null,
        PokeBowl: null,
        LemonCurd: null,
        KumaraFries: null,
      }
    },
    Desserts: {
      Cookies: null,
      IceCream: null,
    },
    Drinks: {
      PinaColada: null,
      Cola: null,
      Juice: null,
    },
  }
};

const readTemplate = (template: any, data: ExplicitDataSource = { items: {} }) => {
  for (const [key, value] of Object.entries(template)) {
    data.items[key] = {
      index: key,
      canMove: true,
      hasChildren: value !== null,
      children: value !== null ? Object.keys(value as object) : undefined,
      data: key,
      canRename: true,
    }

    if (value !== null) {
      readTemplate(value, data);
    }
  }
  return data;
}

const longTree = readTemplate(longTreeTemplate);
const shortTree = readTemplate(shortTreeTemplate);

const demoContent: { data: ExplicitDataSource } = {
  data: {
    items: {
      root: {
        index: 'root',
        hasChildren: true,
        children: ['child1', 'child2'],
        data: 'root',
        canMove: true,
      },
      child1: {
        index: 'child1',
        hasChildren: true,
        children: ['child11'],
        data: 'child1',
        canMove: true,
      },
      child2: {
        index: 'child2',
        hasChildren: true,
        children: ['child21'],
        data: 'child2',
        canMove: true,
      },
      child21: {
        index: 'child21',
        hasChildren: false,
        data: 'child21',
        canMove: true,
      },
      child11: {
        index: 'child11',
        hasChildren: true,
        children: ['child111', 'child112'],
        data: 'child11',
        canMove: true,
      },
      child111: {
        index: 'child111',
        hasChildren: false,
        data: 'child111',
        canMove: true,
      },
      child112: {
        index: 'child112',
        hasChildren: true,
        children: ['child1121'],
        data: 'child112',
        canMove: true,
      },
      child1121: {
        index: 'child1121',
        hasChildren: false,
        data: 'child1121',
        canMove: true,
      },
    }
  }
};


export default {
  title: 'Tree',
  component: ControlledTreeEnvironment,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

export const SingleTree = () => (
  <UncontrolledTreeEnvironment
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const SingleTreeAllCollapsed = () => (
  <UncontrolledTreeEnvironment
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const SmallTree = () => (
  <UncontrolledTreeEnvironment
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    dataProvider={new StaticTreeDataProvider(shortTree.items)}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const MultipleTrees = () => (
  <UncontrolledTreeEnvironment
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
      }
    }}
    {...demoRenderers}
  >
    <div style={{
      display: 'flex',
      backgroundColor: '#D8DEE9',
      justifyContent: 'space-evenly',
      alignItems: 'baseline',
      padding: '20px 0',
    }}>
      <div style={{
        width: '28%',
        backgroundColor: 'white',
      }}>
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree 1" />
      </div>
      <div style={{
        width: '28%',
        backgroundColor: 'white',
      }}>
        <Tree treeId="tree-2" rootItem="root" treeLabel="Tree 2" />
      </div>
      <div style={{
        width: '28%',
        backgroundColor: 'white',
      }}>
        <Tree treeId="tree-3" rootItem="root" treeLabel="Tree 3" />
      </div>
    </div>
  </UncontrolledTreeEnvironment>
);

export const TreeWithDelayedDataProvider = () => (
  <UncontrolledTreeEnvironment
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    dataProvider={{
      getTreeItem: itemId => {
        return new Promise(res => setTimeout(() => res(longTree.items[itemId]), 750));
      }
    }}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

/*
export const ImplicitOrdering = () => (
  <UncontrolledTreeEnvironment
    dataProvider={new StaticTreeDataProvider(longTree.items, (itemA, itemB) => {
      if (itemA.hasChildren !== itemB.hasChildren) {
        return itemA.hasChildren ? 1 : -1;
      } else {
        return (itemA.data as string).localeCompare(itemB.data);
      }
    })}
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" />
  </UncontrolledTreeEnvironment>
);
*/

export const NoDragAndDrop = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const NoDropOnItemsAllowed = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    allowDragAndDrop={true}
    allowReorderingItems={true}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const NoReorderingAllowed = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const AllowDraggingOnlyItemsStartingWithA = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    canDrag={items => items.map(item => (item.data as string).startsWith('A'))
      .reduce((a, b) => a && b, true)}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

export const AllowDroppingOnlyOnItemsStartingWithA = () => (
  <UncontrolledTreeEnvironment<string>
    dataProvider={new StaticTreeDataProvider(longTree.items)}
    allowDragAndDrop={true}
    allowDropOnItemWithChildren={true}
    allowReorderingItems={true}
    canDropAt={(items, target) => target.targetType === 'between-items'
      ? (target.parentItem as string).startsWith('A') : (target.targetItem as string).startsWith('A')}
    getItemTitle={item => item.data}
    viewState={{
      ['tree-1']: {
        expandedItems: ['Fruit', 'Meals', 'America', 'Europe', 'Asia', 'Desserts']
      }
    }}
    {...demoRenderers}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);