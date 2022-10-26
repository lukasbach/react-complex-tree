import { render, fireEvent, act, waitFor } from '@testing-library/react';
import React from 'react';
import {
  TreeEnvironmentRef,
  TreeRef,
  UncontrolledTreeEnvironmentProps,
  Tree,
  TreeViewState,
  StaticTreeDataProvider,
  UncontrolledTreeEnvironment,
  TreeProps,
  IndividualTreeViewState,
} from '../../src';
import { buildTestTree } from './testTree';
import {
  computeItemHeight,
  isOutsideOfContainer,
} from '../../src/controlledEnvironment/layoutUtils';

jest.mock('../../src/controlledEnvironment/layoutUtils');

(computeItemHeight as jest.Mock).mockReturnValue(10);
(isOutsideOfContainer as jest.Mock).mockReturnValue(false);

export class TestUtil {
  private viewState: TreeViewState = {};

  public renderProps?: ReturnType<typeof render>;

  public environmentRef?: TreeEnvironmentRef | null;

  public containerRef?: HTMLDivElement | null;

  public treeRef?: TreeRef | null;

  public tree2Ref?: TreeRef | null;

  public dataProvider = new StaticTreeDataProvider(
    buildTestTree(),
    (item, data) => ({
      ...item,
      data,
    })
  );

  public withViewState(viewState: TreeViewState) {
    this.viewState = viewState;
    return this;
  }

  public withEverythingOpen() {
    const testTree = buildTestTree();
    this.viewState = {
      'tree-1': {
        expandedItems: Object.keys(testTree),
      },
      'tree-2': {
        expandedItems: Object.keys(testTree),
      },
    };
    return this;
  }

  public async clickItem(title: string) {
    fireEvent.click(await this.renderProps!.findByText(title));
  }

  public async controlClick(title: string) {
    fireEvent.click(await this.renderProps!.findByText(title), {
      ctrlKey: true,
    });
  }

  public async controlShiftClick(title: string) {
    fireEvent.click(await this.renderProps!.findByText(title), {
      ctrlKey: true,
      shiftKey: true,
    });
  }

  public async shiftClick(title: string) {
    fireEvent.click(await this.renderProps!.findByText(title), {
      shiftKey: true,
    });
  }

  public async startDrag(title: string) {
    fireEvent.dragStart(await this.renderProps!.findByText(title), {
      dataTransfer: {},
    });
  }

  public async dragOver(title: string, position?: 'top' | 'bottom') {
    await act(async () => {
      const items = await this.renderProps!.findAllByTestId('title');
      const itemIndex = items.findIndex(item => item.innerHTML === title);

      // jsom doesnt support drag events :( let's mock it directly on the dnd context
      this.environmentRef?.dragAndDropContext.onDragOverTreeHandler(
        {
          clientX: 0,
          clientY:
            itemIndex * 10 +
            (position === 'top' ? 1 : position === 'bottom' ? 9 : 5),
        } as any,
        'tree-1',
        { current: this.containerRef ?? undefined }
      );
    });
  }

  public async drop() {
    await act(async () => {
      fireEvent.drop(window);
    });
  }

  public async stopDrag() {
    fireEvent.dragEnd(window);
  }

  public async waitForStableLinearItems(tree = 'tree-1') {
    await waitFor(async () => {
      const items = await this.renderProps!.findAllByTestId('title'); // TODO use correct tree
      const linearItems =
        this.environmentRef?.treeEnvironmentContext.linearItems[tree];
      if (items.length !== linearItems?.length) {
        throw Error(
          `${items.length} rendered items, but ${linearItems?.length} linear items`
        );
      }
      return true;
    });
  }

  public async expectVisible(...items: (string | number | undefined)[]) {
    await Promise.all(
      items
        .filter(item => item)
        .map(
          async item =>
            waitFor(
              () =>
                expect(
                  this.renderProps!.getByText(`${item}`)
                ).toBeInTheDocument(),
              { timeout: 2000 }
            )
          // expect(
          //   await this.renderProps!.findByText(`${item}`)
          // ).toBeInTheDocument()
        )
    );
    return this;
  }

  public async expectNotVisible(...items: (string | number | undefined)[]) {
    const { queryByText } = this.renderProps!;
    items
      .filter(item => item)
      .forEach(item => expect(queryByText(`${item}`)).not.toBeInTheDocument());
    return this;
  }

  public async expectViewState(viewState: IndividualTreeViewState, treeId = 1) {
    expect(this.environmentRef?.viewState[`tree-${treeId}`]).toEqual(viewState);
    await this.expectVisible(
      viewState.focusedItem,
      ...(viewState.selectedItems ?? [])
    );
    return this;
  }

  public async expectItemContents(item: string, contents: string[]) {
    const { children } = await this.dataProvider.getTreeItem(item);
    expect(children).toEqual(contents);
  }

  public async expectVisibleItemContents(item: string, contents: string[]) {
    await this.expectItemContents(item, contents);
    await this.expectVisible(item, ...contents);
    const childrenComponents = document.querySelectorAll(
      `[data-testid="item-container-${item}"] > [data-testid="children"] > ul > li > div > [data-testid="title"]`
    );
    contents.forEach((child, index) =>
      expect(childrenComponents.item(index)).toHaveTextContent(child)
    );
  }

  public async renderOpenTree(
    environmentProps: Partial<UncontrolledTreeEnvironmentProps> = {},
    treeProps: Partial<TreeProps> = {},
    tree2Props: Partial<TreeProps> = {},
    twoTrees = false
  ) {
    this.withEverythingOpen();
    await this.renderTree(environmentProps, treeProps, tree2Props, twoTrees);
    await this.expectVisible('aaa', 'bbb', 'ccc');
    await this.waitForStableLinearItems();
    return this;
  }

  public async renderTree(
    environmentProps: Partial<UncontrolledTreeEnvironmentProps> = {},
    treeProps: Partial<TreeProps> = {},
    tree2Props: Partial<TreeProps> = {},
    twoTrees = false
  ) {
    await act(() => {
      this.renderProps = render(
        <UncontrolledTreeEnvironment
          canDragAndDrop
          canDropOnItemWithChildren
          canReorderItems
          viewState={this.viewState}
          getItemTitle={item => item.data}
          dataProvider={this.dataProvider}
          ref={ref => {
            this.environmentRef = ref;
          }}
          renderItemArrow={props =>
            props.context.isExpanded ? (
              <span>expanded</span>
            ) : (
              <span>collapsed</span>
            )
          }
          renderItem={props => (
            <li
              {...props.context.itemContainerWithChildrenProps}
              style={{ height: 10 }}
              data-testid={`item-container-${props.item.index}`}
            >
              <div {...props.context.itemContainerWithoutChildrenProps}>
                {props.arrow}
                <span
                  {...props.context.interactiveElementProps}
                  data-testid="title"
                >
                  {props.title}
                </span>
              </div>
              <div data-testid="children">{props.children}</div>
            </li>
          )}
          renderTreeContainer={props => (
            <div
              {...props.containerProps}
              ref={ref => {
                this.containerRef = ref;
                (props as any).containerProps.ref = ref;
              }}
            >
              {props.children}
            </div>
          )}
          {...environmentProps}
        >
          <Tree
            treeId="tree-1"
            rootItem="root"
            treeLabel="treelabel"
            ref={ref => {
              this.treeRef = ref;
            }}
            {...treeProps}
          />
          {twoTrees ? (
            <Tree
              treeId="tree-2"
              rootItem="root"
              treeLabel="treelabel"
              ref={ref => {
                this.tree2Ref = ref;
              }}
              {...tree2Props}
            />
          ) : null}
        </UncontrolledTreeEnvironment>
      );
    });

    return this;
  }
}
