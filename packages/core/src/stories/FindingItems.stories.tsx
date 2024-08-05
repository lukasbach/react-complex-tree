import { Meta } from '@storybook/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { longTree } from 'demodata';
import { UncontrolledTreeEnvironment } from '../uncontrolledEnvironment/UncontrolledTreeEnvironment';
import { StaticTreeDataProvider } from '../uncontrolledEnvironment/StaticTreeDataProvider';
import { Tree } from '../tree/Tree';
import { TreeItemIndex, TreeRef } from '../types';

export default {
  title: 'Core/Finding Items',
} as Meta;

export const CustomFinder = () => {
  const [search, setSearch] = useState('pizza');
  const tree = useRef<TreeRef>(null);

  const dataProvider = useMemo(
    () =>
      new StaticTreeDataProvider(longTree.items, (item, data) => ({
        ...item,
        data,
      })),
    []
  );

  const findItemPath = useCallback(
    async (search: string, searchRoot: TreeItemIndex = 'root') => {
      const item = await dataProvider.getTreeItem(searchRoot);
      if (item.data.toLowerCase().includes(search.toLowerCase())) {
        return [item.index];
      }
      const searchedItems = await Promise.all(
        item.children?.map(child => findItemPath(search, child)) ?? []
      );
      const result = searchedItems.find(item => item !== null);
      if (!result) {
        return null;
      }
      return [item.index, ...result];
    },
    [dataProvider]
  );

  const find = useCallback(
    e => {
      e.preventDefault();
      if (search) {
        findItemPath(search).then(path => {
          if (path) {
            // wait for full path including leaf, to make sure it loaded in
            tree.current?.expandSubsequently(path).then(() => {
              tree.current?.selectItems([path[path.length - 1]]);
              tree.current?.focusItem(path[path.length - 1]);
            });
          }
        });
      }
    },
    [findItemPath, search]
  );

  return (
    <>
      <form onSubmit={find}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit">Find item</button>
      </form>
      <UncontrolledTreeEnvironment<string>
        dataProvider={dataProvider}
        getItemTitle={item => item.data}
        viewState={{
          'tree-1': {},
        }}
      >
        <Tree
          treeId="tree-1"
          rootItem="root"
          treeLabel="Tree Example"
          ref={tree}
        />
      </UncontrolledTreeEnvironment>
    </>
  );
};
