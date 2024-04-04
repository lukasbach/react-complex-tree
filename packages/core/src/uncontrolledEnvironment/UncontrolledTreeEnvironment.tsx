import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  IndividualTreeViewState,
  TreeEnvironmentRef,
  TreeItem,
  TreeItemIndex,
  UncontrolledTreeEnvironmentProps,
} from '../types';
import { ControlledTreeEnvironment } from '../controlledEnvironment/ControlledTreeEnvironment';
import { CompleteTreeDataProvider } from './CompleteTreeDataProvider';
import { useIsMounted } from '../useIsMounted';
import { useRefCopy } from '../useRefCopy';

/* const createCompleteDataProvider = (provider: TreeDataProvider): CompleteTreeDataProvider => ({ // TODO Write class that internally uses provider instead
  ...provider,
  getTreeItem: provider.getTreeItem,
  onDidChangeTreeData: provider.onDidChangeTreeData?.bind(provider) ?? (() => ({ dispose: () => {} })),
  getTreeItems: provider.getTreeItems?.bind(provider) ?? (itemIds => Promise.all(itemIds.map(id => provider.getTreeItem(id)))),
  onRenameItem: provider.onRenameItem?.bind(provider) ?? (async () => {}),
  onChangeItemChildren: provider.onChangeItemChildren?.bind(provider) ?? (async () => {}),
}); */

export const UncontrolledTreeEnvironment = React.forwardRef<
  TreeEnvironmentRef,
  UncontrolledTreeEnvironmentProps
>((props, ref) => {
  const [currentItems, setCurrentItems] = useState<
    Record<TreeItemIndex, TreeItem>
  >({});
  const [viewState, setViewState] = useState(props.viewState);
  const viewStateRef = useRefCopy(viewState);
  const missingItemIds = useRef<TreeItemIndex[]>([]);
  const dataProvider = useMemo(
    () => new CompleteTreeDataProvider(props.dataProvider),
    [props.dataProvider]
  );
  const isMounted = useIsMounted();

  const writeItems = useCallback(
    (newItems: Record<TreeItemIndex, TreeItem>) => {
      if (!isMounted.current) return;
      setCurrentItems(oldItems => ({ ...oldItems, ...newItems }));
    },
    [isMounted]
  );

  const amendViewState = useCallback(
    (
      treeId: string,
      constructNewState: (
        oldState: IndividualTreeViewState<any>
      ) => Partial<IndividualTreeViewState<any>>
    ) => {
      setViewState(oldState => ({
        ...oldState,
        [treeId]: {
          ...oldState[treeId],
          ...constructNewState(oldState[treeId] ?? {}),
        },
      }));
    },
    []
  );

  useEffect(() => {
    const { dispose } = dataProvider.onDidChangeTreeData(changedItemIds => {
      dataProvider.getTreeItems(changedItemIds).then(items => {
        writeItems(
          items
            .map(item => ({ [item.index]: item }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        );
      });
    });

    return dispose;
  }, [dataProvider, writeItems]);

  // TODO memoize props or this component itself
  return (
    <ControlledTreeEnvironment
      {...props}
      ref={ref}
      viewState={viewState}
      items={currentItems}
      onExpandItem={(item, treeId) => {
        amendViewState(treeId, old => ({
          ...old,
          expandedItems: [...(old.expandedItems ?? []), item.index],
        }));
        props.onExpandItem?.(item, treeId);
      }}
      onCollapseItem={(item, treeId) => {
        amendViewState(treeId, old => ({
          ...old,
          expandedItems: old.expandedItems?.filter(id => id !== item.index),
        }));
        props.onCollapseItem?.(item, treeId);
      }}
      onSelectItems={(items, treeId) => {
        const oldFocusedItem = viewStateRef.current[treeId]?.focusedItem;

        if (props.disableMultiselect) {
          const newSelected = oldFocusedItem ? [oldFocusedItem] : [];
          props.onSelectItems?.(newSelected, treeId);
          amendViewState(treeId, old => ({
            ...old,
            selectedItems: newSelected,
          }));
        } else {
          props.onSelectItems?.(items, treeId);
          amendViewState(treeId, old => ({ ...old, selectedItems: items }));
        }
      }}
      onFocusItem={(item, treeId) => {
        amendViewState(treeId, old => ({ ...old, focusedItem: item.index }));
        props.onFocusItem?.(item, treeId);
      }}
      onRenameItem={async (item, name, treeId) => {
        await dataProvider.onRenameItem(item, name);
        amendViewState(treeId, old => ({ ...old, renamingItem: undefined }));
        const newItem = await dataProvider.getTreeItem(item.index);
        writeItems({ [item.index]: newItem });
        props.onRenameItem?.(item, name, treeId);
      }}
      onDrop={async (items, target) => {
        const promises: Promise<void>[] = [];
        const itemsIndices = items.map(i => i.index);
        let itemsPriorToInsertion = 0;

        // move old items out
        for (const item of items) {
          const parent = Object.values(currentItems).find(potentialParent =>
            potentialParent?.children?.includes?.(item.index)
          );

          if (!parent) {
            throw Error(`Could not find parent of item "${item.index}"`);
          }

          if (!parent.children) {
            throw Error(
              `Parent "${parent.index}" of item "${item.index}" did not have any children`
            );
          }

          if (
            target.targetType === 'between-items' &&
            target.parentItem === item.index
          ) {
            // Trying to drop inside itself
            return;
          }

          if (
            (target.targetType === 'item' || target.targetType === 'root') &&
            target.targetItem !== parent.index
          ) {
            promises.push(
              dataProvider.onChangeItemChildren(
                parent.index,
                parent.children.filter(child => child !== item.index)
              )
            );
          }

          if (target.targetType === 'between-items') {
            if (target.parentItem === parent.index) {
              const newParent = currentItems[target.parentItem];
              const isOldItemPriorToNewItem =
                ((newParent.children ?? []).findIndex(
                  child => child === item.index
                ) ?? Infinity) < target.childIndex;
              itemsPriorToInsertion += isOldItemPriorToNewItem ? 1 : 0;
            } else {
              promises.push(
                dataProvider.onChangeItemChildren(
                  parent.index,
                  parent.children.filter(child => child !== item.index)
                )
              );
            }
          }
        }

        // insert new items
        if (target.targetType === 'item' || target.targetType === 'root') {
          promises.push(
            dataProvider.onChangeItemChildren(target.targetItem, [
              ...(currentItems[target.targetItem].children ?? []).filter(
                i => !itemsIndices.includes(i)
              ),
              ...itemsIndices,
            ])
          );
        } else {
          const newParent = currentItems[target.parentItem];
          const newParentChildren = [...(newParent.children ?? [])].filter(
            c => !itemsIndices.includes(c)
          );
          newParentChildren.splice(
            target.childIndex - itemsPriorToInsertion,
            0,
            ...itemsIndices
          );
          promises.push(
            dataProvider.onChangeItemChildren(
              target.parentItem,
              newParentChildren
            )
          );
        }

        await Promise.all(promises);
        props.onDrop?.(items, target);
      }}
      onMissingItems={itemIds => {
        // Batch individual fetch-item-calls together
        if (missingItemIds.current.length === 0) {
          setTimeout(() => {
            dataProvider.getTreeItems(missingItemIds.current).then(items => {
              writeItems(
                items
                  .map(item => ({ [item?.index]: item }))
                  .reduce((a, b) => ({ ...a, ...b }), {})
              );
            });
            missingItemIds.current = [];
          });
        }

        missingItemIds.current.push(...itemIds);
        props.onMissingItems?.(itemIds);
      }}
    >
      {props.children}
    </ControlledTreeEnvironment>
  );
}) as <T = any, C extends string = never>(
  p: UncontrolledTreeEnvironmentProps<T, C> & {
    ref?: React.Ref<TreeEnvironmentRef<T, C>>;
  }
) => React.ReactElement;
