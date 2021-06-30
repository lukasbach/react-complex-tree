import * as React from 'react';
import { TreeEnvironmentRef, TreeContextProps, TreeRef } from 'react-complex-tree';
import { useEffect, useRef, useState } from 'react';

export interface AutomationStoryHelpers {
  wait: (ms: number) => Promise<void>,
  env: React.RefObject<TreeEnvironmentRef>,
  tree: React.RefObject<TreeRef>,
  tree1: React.RefObject<TreeRef>,
  tree2: React.RefObject<TreeRef>,
  tree3: React.RefObject<TreeRef>,
  tree4: React.RefObject<TreeRef>,
  tree5: React.RefObject<TreeRef>,
  searchFor: (tree: TreeRef, search: string, timeBetweenTypes?: number) => Promise<void>,
  programmaticMove: (direction: 'up' | 'down', times: number, timeBetweenMoves?: number) => Promise<void>;
  renameTo: (tree: TreeRef, newName: string, timeBetweenTypes?: number) => Promise<void>,
}

export const AutoDemo = (props: {
  // initialState: UncontrolledTreeEnvironmentProps,
  children: (
    environmentProps: { key: string },
    environmentRef: React.Ref<TreeEnvironmentRef>, treeRef: React.Ref<TreeRef>,
    treeRef2: React.Ref<TreeRef>, treeRef3: React.Ref<TreeRef>,
    treeRef4: React.Ref<TreeRef>, treeRef5: React.Ref<TreeRef>,
  ) => JSX.Element,
  storyScript: (story: AutomationStoryHelpers) => Promise<void>
}) => {
  const [restartKey, setRestartKey] = useState(0);
  const environmentRef = useRef<TreeEnvironmentRef>(null);
  const treeRef1 = useRef<TreeRef>(null);
  const treeRef2 = useRef<TreeRef>(null);
  const treeRef3 = useRef<TreeRef>(null);
  const treeRef4 = useRef<TreeRef>(null);
  const treeRef5 = useRef<TreeRef>(null);

  useEffect(() => {

    console.log(treeRef1.current, treeRef2.current, treeRef3.current, treeRef4.current, treeRef5.current, environmentRef.current)
  }, [treeRef1.current, environmentRef.current])

  useEffect(() => {
    setTimeout(() => {
      const helpers: AutomationStoryHelpers = {
        env: environmentRef,
        tree: treeRef1,
        tree1: treeRef1,
        tree2: treeRef2,
        tree3: treeRef3,
        tree4: treeRef4,
        tree5: treeRef5,
        renameTo: async (tree, newName, timeBetweenTypes = 200) => {
          tree.startRenamingItem(environmentRef.current!.viewState[tree.treeId]!.focusedItem!);
          for (const char in newName.split('')) {
            return new Promise(r => setTimeout(r, timeBetweenTypes));
          }
        },
        searchFor: async (tree, search, timeBetweenTypes = 200) => {
          let pieces = '';
          for (const char of search.split('')) {
            pieces += char;
            tree.setSearch(pieces);
            await helpers.wait(timeBetweenTypes);
          }
        },
        programmaticMove: async (direction, times, timeBetweenMoves = 100) => {
          for (let i = 0; i < times; i++) {
            if (direction === 'up') {
              environmentRef.current!.moveProgrammaticDragPositionUp();
            } else {
              environmentRef.current!.moveProgrammaticDragPositionDown();
            }
            await helpers.wait(i < times * .2 || i > times * .8 ? timeBetweenMoves * 2 : timeBetweenMoves);
          }
        },
        wait: async ms => {
          return new Promise(r => setTimeout(r, ms));
        }
      };

      props.storyScript(helpers);
    }, 1000);
  }, [restartKey]);

  return (
    <div>
      Tree (<button onClick={() => setRestartKey(k => k + 1)}>Restart</button>)<br />
      {props.children({ key: `k${restartKey}` }, environmentRef, treeRef1, treeRef2, treeRef3, treeRef4, treeRef5)}
    </div>
  );
};
