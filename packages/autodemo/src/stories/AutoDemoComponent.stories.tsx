import { Meta } from '@storybook/react';
import React from 'react';
import { StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment } from 'react-complex-tree';
import { longTree } from 'demodata';
import { AutoDemo } from '../AutoDemo';

export default {
  title: 'Auto Demo/AutoDemo Component',
} as Meta;


const treeId1 = 'tree-1';
const treeId2 = 'tree-2';

export const SingleTreeDemo = () => (
  <AutoDemo
    data={ longTree }
    storyScript={ async (story) => {
      await story.tree.current!.focusTree(false);
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
    } }
  >
    { (environmentProps, environmentRef, treeRef) => (
      <UncontrolledTreeEnvironment<string>
        allowDragAndDrop={ true }
        allowDropOnItemWithChildren={ true }
        allowReorderingItems={ true }
        getItemTitle={ item => item.data }
        viewState={ {
          [treeId1]: {
            expandedItems: ['Fruit', 'Meals'],
          },
        } }
        ref={ environmentRef }
        { ...environmentProps }
      >
        <Tree treeId={ treeId1 } rootItem="root" treeLabel="Tree Example" ref={ treeRef }/>
      </UncontrolledTreeEnvironment>
    ) }
  </AutoDemo>
);


export const MultiTreeDemo = () => (
  <AutoDemo
    restart={ true }
    data={ longTree }
    storyScript={ async (story) => {
      await story.tree.current!.focusTree(false);
      await story.searchFor(story.tree.current!, 'banana');
      await story.wait(1000);
      await story.tree.current!.moveFocusUp();
      await story.wait(500);
      await story.tree.current!.moveFocusUp();
      await story.wait(500);
      await story.tree.current!.moveFocusUp();
      await story.wait(500);
      await story.tree.current!.moveFocusUp();
      await story.wait(1000);
      await story.tree2.current!.focusTree(false);
      await story.wait(500);
      await story.tree2.current!.moveFocusDown();
      await story.wait(500);
      await story.tree2.current!.moveFocusDown();
      await story.wait(500);
      await story.tree2.current!.moveFocusDown();
      await story.wait(1000);
      await story.tree2.current!.expandItem(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(1000);
      await story.tree.current!.focusTree(false);
      await story.wait(500);
      await story.tree.current!.moveFocusDown();
      await story.wait(500);
      await story.tree.current!.moveFocusDown();
      await story.wait(500);
      await story.tree.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId1]!.focusedItem!);
      await story.wait(500);
      await story.tree.current!.moveFocusDown();
      await story.wait(500);
      await story.tree.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId1]!.focusedItem!);
      await story.wait(500);
      await story.tree.current!.moveFocusDown();
      await story.wait(500);
      await story.tree.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId1]!.focusedItem!);
      await story.wait(1000);
      await story.env.current!.startProgrammaticDrag();
      await story.wait(1000);
      await story.tree2.current!.focusTree(false);
      await story.wait(500);
      await story.programmaticMove('down', 4);
      await story.wait(500);
      await story.env.current!.completeProgrammaticDrag();
      await story.wait(1000);
      await story.tree2.current!.moveFocusUp();
      await story.wait(500);
      await story.tree2.current!.moveFocusUp();
      await story.wait(500);
      await story.tree2.current!.moveFocusUp();
      await story.wait(500);
      await story.tree2.current!.moveFocusUp();
      await story.wait(1000);
      await story.tree2.current!.collapseItem(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(1000);
      await story.tree2.current!.moveFocusUp();
      await story.wait(500);
      await story.tree2.current!.moveFocusUp();
      await story.wait(500);
      await story.tree2.current!.expandItem(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(500);
      await story.tree2.current!.moveFocusDown();
      await story.wait(500);
      await story.tree2.current!.expandItem(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(200);
      await story.tree2.current!.moveFocusDown();
      await story.wait(200);
      await story.tree2.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(200);
      await story.tree2.current!.moveFocusDown();
      await story.wait(200);
      await story.tree2.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(200);
      await story.tree2.current!.moveFocusDown();
      await story.wait(200);
      await story.tree2.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(200);
      await story.tree2.current!.moveFocusDown();
      await story.wait(200);
      await story.tree2.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(200);
      await story.tree2.current!.moveFocusDown();
      await story.wait(200);
      await story.tree2.current!.toggleItemSelectStatus(story.env.current!.viewState[treeId2]!.focusedItem!);
      await story.wait(1000);
      await story.env.current!.startProgrammaticDrag();
      await story.programmaticMove('down', 8);
      await story.env.current!.completeProgrammaticDrag();
      await story.wait(1000);
      await story.tree.current!.focusTree(false);
      await story.wait(200);
      await story.searchFor(story.tree.current!, 'meals');
      await story.wait(500);
      await story.tree.current!.collapseItem(story.env.current!.viewState[treeId1]!.focusedItem!);
      await story.wait(1000);
      await story.tree2.current!.focusTree(false);
      await story.wait(200);
      await story.env.current!.startProgrammaticDrag();
      await story.wait(1300);
      await story.programmaticMove('down', 2);
      await story.wait(1300);
      await story.env.current!.completeProgrammaticDrag();
      await story.wait(1500);
      await story.searchFor(story.tree2.current!, 'drinks');
      await story.wait(1000);
      await story.tree2.current!.selectItems([story.env.current!.viewState[treeId2]!.focusedItem!]);
      await story.wait(500);
      await story.env.current!.startProgrammaticDrag();
      await story.programmaticMove('up', 26);
      await story.wait(1000);
      await story.env.current!.completeProgrammaticDrag();
      await story.wait(5000);
    } }
  >
    { (environmentProps, environmentRef, treeRef, treeRef2) => (
      <UncontrolledTreeEnvironment<string>
        allowDragAndDrop={ true }
        allowDropOnItemWithChildren={ true }
        allowReorderingItems={ true }
        getItemTitle={ item => item.data }
        viewState={ {
          [treeId1]: {
            expandedItems: ['Fruit', 'Meals'],
          },
        } }
        ref={ environmentRef }
        { ...environmentProps }
      >
        <Tree treeId={ treeId1 } rootItem="root" treeLabel="Tree Example" ref={ treeRef }/>
        <Tree treeId={ treeId2 } rootItem="root" treeLabel="Tree Example" ref={ treeRef2 }/>
      </UncontrolledTreeEnvironment>
    ) }
  </AutoDemo>
);