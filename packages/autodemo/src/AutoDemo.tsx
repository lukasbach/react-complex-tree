import * as React from 'react';
import {
  TreeEnvironmentRef,
  TreeRef,
  UncontrolledTreeEnvironmentProps,
  StaticTreeDataProvider,
  ExplicitDataSource,
  createDefaultRenderers,
} from 'react-complex-tree';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface AutomationStoryHelpers {
  wait: (ms: number) => Promise<void>;
  env: React.RefObject<TreeEnvironmentRef>;
  tree: React.RefObject<TreeRef>;
  tree1: React.RefObject<TreeRef>;
  tree2: React.RefObject<TreeRef>;
  tree3: React.RefObject<TreeRef>;
  tree4: React.RefObject<TreeRef>;
  tree5: React.RefObject<TreeRef>;
  searchFor: (
    tree: TreeRef,
    search: string,
    timeBetweenTypes?: number
  ) => Promise<void>;
  programmaticMove: (
    direction: 'up' | 'down',
    times: number,
    timeBetweenMoves?: number
  ) => Promise<void>;
  renameTo: (
    tree: TreeRef,
    newName: string,
    timeBetweenTypes?: number
  ) => Promise<void>;
}

export interface ProvidedEnvironmentProps
  extends Pick<
    UncontrolledTreeEnvironmentProps,
    'dataProvider' | 'renderItem'
  > {
  key: string;
}

const localStorageKeySpeed = 'rct-autodemo-speed';

export const AutoDemo = (props: {
  data: ExplicitDataSource;
  children: (
    environmentProps: ProvidedEnvironmentProps,
    environmentRef: React.Ref<TreeEnvironmentRef>,
    treeRef: React.Ref<TreeRef>,
    treeRef2: React.Ref<TreeRef>,
    treeRef3: React.Ref<TreeRef>,
    treeRef4: React.Ref<TreeRef>,
    treeRef5: React.Ref<TreeRef>
  ) => JSX.Element;
  storyScript: (story: AutomationStoryHelpers) => Promise<void>;
  restart?: boolean;
}) => {
  const [aborted, setAborted] = useState(false);
  const abortedRef = useRef(false);
  const [restartKey, setRestartKey] = useState(0);
  const [speed, setSpeed] = useState(
    parseFloat(localStorage.getItem('rct-autodemo-speed') ?? '1')
  );
  const speedRef = useRef(
    parseFloat(localStorage.getItem('rct-autodemo-speed') ?? '1')
  );
  const environmentRef = useRef<TreeEnvironmentRef>(null);
  const treeRef1 = useRef<TreeRef>(null);
  const treeRef2 = useRef<TreeRef>(null);
  const treeRef3 = useRef<TreeRef>(null);
  const treeRef4 = useRef<TreeRef>(null);
  const treeRef5 = useRef<TreeRef>(null);

  useEffect(() => {
    localStorage.setItem(localStorageKeySpeed, `${speed}`);
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    abortedRef.current = aborted;
  }, [aborted]);

  useEffect(() => {
    setAborted(false);
    abortedRef.current = false;
    setTimeout(async () => {
      const helpers: AutomationStoryHelpers = {
        env: environmentRef,
        tree: treeRef1,
        tree1: treeRef1,
        tree2: treeRef2,
        tree3: treeRef3,
        tree4: treeRef4,
        tree5: treeRef5,
        renameTo: async (tree, newName, timeBetweenTypes = 200) => {
          // tree.startRenamingItem(
          //   environmentRef.current!.viewState[tree.treeId]!.focusedItem!
          // );
          // for (const char in newName.split('')) {
          //   return new Promise(r => setTimeout(r, timeBetweenTypes));
          // }
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
          for (let i = 0; i < times; i += 1) {
            if (direction === 'up') {
              environmentRef.current!.moveProgrammaticDragPositionUp();
            } else {
              environmentRef.current!.moveProgrammaticDragPositionDown();
            }
            await helpers.wait(
              i < times * 0.2 || i > times * 0.8
                ? timeBetweenMoves * 2
                : timeBetweenMoves
            );
          }
        },
        wait: async ms => {
          if (abortedRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw 'abort';
          }
          await new Promise(r => setTimeout(r, ms * (1 / speedRef.current)));
          if (abortedRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw 'abort';
          }
        },
      };

      try {
        await props.storyScript(helpers);
        if (props.restart) {
          setRestartKey(oldKey => oldKey + 1);
        }
      } catch (e) {
        if (e !== 'abort') {
          throw e;
        }
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartKey]);

  const envProps: ProvidedEnvironmentProps = useMemo<ProvidedEnvironmentProps>(
    () => ({
      key: `k${restartKey}`,
      autoFocus: aborted,
      dataProvider: new StaticTreeDataProvider(
        JSON.parse(JSON.stringify(props.data.items)),
        (item, data) => ({
          ...item,
          data,
        })
      ),
      renderItem: p =>
        createDefaultRenderers(10).renderItem({
          ...p,
          context: {
            ...p.context,
            interactiveElementProps: {
              ...p.context.interactiveElementProps,
              tabIndex: aborted
                ? p.context.interactiveElementProps.tabIndex
                : -2,
            },
          },
        }),
    }),
    [restartKey, aborted, props.data.items]
  );

  const SpeedButton: React.FC<{ speed: number }> = props => (
    <button
      className={props.speed === speed ? 'active' : ''}
      onClick={() => setSpeed(props.speed)}
    >
      x{props.speed}
    </button>
  );

  return (
    <div className="rct-autodemo-container">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={[
          'rct-autodemo-content',
          treeRef1.current !== null ? 'rct-autodemo-content-childcount-1' : '',
          treeRef2.current !== null ? 'rct-autodemo-content-childcount-2' : '',
          treeRef3.current !== null ? 'rct-autodemo-content-childcount-3' : '',
          treeRef4.current !== null ? 'rct-autodemo-content-childcount-4' : '',
          treeRef5.current !== null ? 'rct-autodemo-content-childcount-5' : '',
        ].join(' ')}
        onMouseDown={() => setAborted(true)}
        onKeyDown={() => setAborted(true)}
      >
        {props.children(
          envProps,
          environmentRef,
          treeRef1,
          treeRef2,
          treeRef3,
          treeRef4,
          treeRef5
        )}
      </div>
      <div className="rct-autodemo-controls">
        <div className="rct-autodemo-controls-left">
          <div className="rct-autodemo-controls-header">
            <h2>{!aborted ? 'Demo is running' : 'Demo was stopped'}</h2>
            <div
              className="rct-autodemo-controls-speed"
              aria-label="Speed control for the demo"
            >
              <SpeedButton speed={0.75} />
              <SpeedButton speed={1} />
              <SpeedButton speed={2} />
              <SpeedButton speed={3} />
            </div>
          </div>
          <p>
            {!aborted ? 'Click anywhere on the tree to try it yourself!' : ''}
          </p>
        </div>
        <div className="rct-autodemo-controls-right">
          <button
            onClick={() => {
              if (aborted) {
                setRestartKey(k => k + 1);
              } else {
                setAborted(true);
              }
            }}
          >
            {aborted ? 'Restart' : 'Abort'}
          </button>
        </div>
      </div>
    </div>
  );
};
