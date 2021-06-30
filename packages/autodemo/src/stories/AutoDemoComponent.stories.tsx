import { Meta } from '@storybook/react';
import React from 'react';
import { StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment } from 'react-complex-tree';
import { longTree } from '../../../core/src/stories/utils/treeData.stories';
import { AutoDemo } from '../AutoDemo';

export default {
  title: 'Auto Demo/AutoDemo Component',
} as Meta;

const treeId1 = 'tree-1';

export const DummyAutoDemo = () => (
  <AutoDemo
    storyScript={async (story) => {
      await story.tree.current!.focusTree();
      await story.searchFor(story.tree.current!, 'banana');
      await story.wait(1000);
      await story.tree.current!.moveFocusDown();
      await story.wait(200);
      await story.tree.current!.moveFocusDown();
      await story.wait(500);
      await story.tree.current!.expandItem(story.env.current!.viewState[treeId1]!.focusedItem!);
      await story.wait(500);
      await story.tree.current!.moveFocusDown();
      await story.wait(200);
      await story.tree.current!.moveFocusDown();
      await story.wait(1000);
      await story.searchFor(story.tree.current!, 'cheese');
      await story.wait(200);
      await story.tree.current!.abortSearch();
      await story.wait(1000);
      await story.tree.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId1]!.focusedItem!);
      await story.wait(1000);
      await story.tree.current!.moveFocusDown();
      await story.wait(500);
      await story.tree.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId1]!.focusedItem!);
      await story.wait(1000);
      await story.env.current!.startProgrammaticDrag();
      await story.wait(500);
      await story.programmaticMove('up', 16);
      await story.wait(1000);
      await story.env.current!.completeProgrammaticDrag();
      await story.wait(1000);
      await story.env.current!.startProgrammaticDrag();
      await story.wait(500);
      await story.programmaticMove('down', 2, 500);
      await story.wait(1000);
      await story.env.current!.completeProgrammaticDrag();
    }}
  >
    {(environmentProps, environmentRef, treeRef) => (
      <UncontrolledTreeEnvironment<string>
        allowDragAndDrop={true}
        allowDropOnItemWithChildren={true}
        allowReorderingItems={true}
        dataProvider={new StaticTreeDataProvider(longTree.items, (item, data) => ({...item, data}))}
        getItemTitle={item => item.data}
        viewState={{
          [treeId1]: {
            expandedItems: ['Fruit', 'Meals', 'Europe', 'Asia', 'Desserts']
          }
        }}
        ref={environmentRef}
        {...environmentProps}
      >
        <Tree treeId={treeId1} rootItem="root" treeLabel="Tree Example" ref={treeRef} />
      </UncontrolledTreeEnvironment>
    )}
  </AutoDemo>
);