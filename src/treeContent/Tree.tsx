import * as React from 'react';
import { AllTreeRenderProps, ControlledTreeEnvironmentProps, TreeProps, TreeRenderProps } from '../types';
import { HTMLProps, useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItemChildren } from './TreeItemChildren';

export const TreeRenderContext = React.createContext<TreeRenderProps>(null as any);
export const TreeIdContext = React.createContext<string>('__no_tree');

export const Tree = <T extends any>(props: TreeProps<T>) => {
  const environment = useContext(TreeEnvironmentContext);
  const renderers = useMemo<AllTreeRenderProps>(() => ({ ...environment, ...props }), [props, environment]);
  const rootItem = environment.items[props.rootItem];
  const containerRef = useRef<HTMLElement>();

  useEffect(() => {
    environment.registerTree({
      treeId: props.treeId,
      rootItem: props.rootItem
    });

    return () => environment.unregisterTree(props.treeId);
  }, [ props.treeId, props.rootItem ]);

  if (rootItem === undefined) {
    environment.onMissingItems?.([props.rootItem]);
    return null;
  }

  const rootChildren = rootItem.children;

  if (!rootChildren) {
    throw Error(`Root ${props.rootItem} does not contain any children`);
  }

  const treeChildren = <TreeItemChildren children={rootChildren} depth={0} parentId={props.treeId} />;

  const containerProps: HTMLProps<any> = {
    onDrag: e => {
      const hoveringPosition = (e.clientY - containerRef.current!.offsetTop) / environment.itemHeight;
      if (hoveringPosition % 1 < .1 || hoveringPosition % 1 > .9) {

      } else {
        Math.floor(hoveringPosition);
      }
    },
    ref: containerRef
  };

  return (
    <TreeRenderContext.Provider value={renderers}>
      <TreeIdContext.Provider value={props.treeId}>
        {renderers.renderTreeContainer(treeChildren, containerProps)}
      </TreeIdContext.Provider>
    </TreeRenderContext.Provider>
  );
};

export const ComponentMy = React.forwardRef<HTMLInputElement | null, {}>((props, ref) => {
    const elementRef = useRef<HTMLInputElement>(null);
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
        ref,
        () => elementRef.current && {
            ...elementRef.current,
        },
    );

    return (
        <input ref={elementRef} />
    );
});