import type { TreeRef, TreeRenderProps } from 'react-complex-tree';
import { useVirtual, Options } from 'react-virtual';
import React, {
  HTMLAttributes,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(cn => !!cn).join(' ');

export const useVirtualTree = ({
  virtualizedOptions,
  treeRef,
  scrollContainerProps,
  parentContainerProps,
  height,
}: {
  virtualizedOptions?: Partial<Options<any>>;
  scrollContainerProps?: HTMLAttributes<HTMLUListElement>;
  parentContainerProps?: HTMLAttributes<HTMLDivElement>;
  height?: string;
  treeRef: MutableRefObject<TreeRef | null>;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(treeRef.current?.linearList?.length);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    // setSize(treeRef.current?.linearList?.length);
    const handler = treeRef.current?.onChangeLinearList.on(items => {
      if (sizeRef.current !== items.length) {
        console.log('UPDATE SIZE', items.length, sizeRef.current);
        setSize(items.length);
      }
    });
    return () => {
      if (handler !== undefined) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        treeRef.current?.onChangeLinearList.off(handler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowVirtualizer = useVirtual({
    estimateSize: () => 30,
    ...virtualizedOptions,
    size: size ?? 0,
    parentRef,
  });
  console.log(rowVirtualizer);

  return {
    parentRef,
    renderProps: {
      renderTreeContainer: useCallback<
        TreeRenderProps['renderTreeContainer'] & Function
      >(
        ({ children, containerProps, info }) => (
          <div
            className={cx(
              'rct-tree-root',
              info.isFocused && 'rct-tree-root-focus',
              info.isRenaming && 'rct-tree-root-renaming',
              info.areItemsSelected && 'rct-tree-root-itemsselected'
            )}
            {...parentContainerProps}
            {...containerProps}
            ref={mergeRefs(
              containerProps?.ref
                ? [parentRef, containerProps?.ref]
                : [parentRef]
            )}
            style={{
              height,
              overflow: 'auto',
              ...(parentContainerProps?.style ?? {}),
            }}
          >
            {children}
          </div>
        ),
        [height, parentContainerProps]
      ),
      renderItemsContainer: useCallback<
        TreeRenderProps['renderItemsContainer'] & Function
      >(
        ({ children, containerProps }) => (
          <ul
            {...scrollContainerProps}
            {...containerProps}
            style={{
              width: '100%',
              ...(scrollContainerProps?.style ?? {}),
              position: 'relative',
              height: `${rowVirtualizer.totalSize}px`,
            }}
            className="rct-tree-items-container"
          >
            {children}
          </ul>
        ),
        [scrollContainerProps, rowVirtualizer.totalSize]
      ),
      renderLinearList: useCallback<
        TreeRenderProps['renderLinearList'] & Function
      >(
        ({ renderItem, items }) => (
          <>
            {rowVirtualizer.virtualItems.map(({ size, start, index }) => {
              const { item, depth } = items[index];
              // return <div />;
              return renderItem({
                itemIndex: item,
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${size}px`,
                  transform: `translateY(${start}px)`,
                },
                // TODO pass size
                key: `${index}`,
                depth,
              });
            })}
          </>
        ),
        [rowVirtualizer.virtualItems]
      ),
    },
  };
};
