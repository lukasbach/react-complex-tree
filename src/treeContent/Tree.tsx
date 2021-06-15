import * as React from 'react';
import { ControlledTreeEnvironmentProps, TreeProps, TreeRenderProps } from '../types';
import { useContext, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { TreeEnvironmentContext } from '../controlledEnvironment/ControlledTreeEnvironment';
import { TreeItemChildren } from './TreeItemChildren';

export const TreeRenderContext = React.createContext<TreeRenderProps>(null as any);

export const Tree = <T extends any>(props: TreeProps<T>) => {
  const environment = useContext(TreeEnvironmentContext);
  const renderers = useMemo<TreeRenderProps>(() => ({ ...environment, ...props }), [props, environment]);
  const rootItem = environment.items[props.rootItem];

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

  return (
    <TreeRenderContext.Provider value={renderers}>
      <TreeItemChildren children={rootChildren} depth={0} parentId={props.treeId} />
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