/* eslint-disable no-await-in-loop */
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
import '@testing-library/jest-dom';

jest.mock('../../src/controlledEnvironment/layoutUtils');

(computeItemHeight as jest.Mock).mockReturnValue(10);
(isOutsideOfContainer as jest.Mock).mockReturnValue(false);

export class TestUtil {
  private viewState: TreeViewState = {
    'tree-1': {},
    'tree-2': {},
  };

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
    this.viewState = { ...this.viewState, viewState };
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

  public withInitialFocus(item: string, treeId = 'tree-1') {
    this.viewState[treeId]!.focusedItem = item;
    return this;
  }

  public async focusTree(treeId = 'tree-1') {
    (treeId === 'tree-1' ? this.treeRef : this.tree2Ref)?.focusTree();
  }

  public async selectItems(...titles: string[]) {
    await this.clickItem(titles[0]);
    for (const title of titles.slice(1)) {
      await this.controlClick(title);
    }
  }

  public async clickItem(title: string) {
    await this.expectVisible(title);
    await act(async () => {
      fireEvent.click(await this.renderProps!.findByText(title));
    });
  }

  public async controlClick(title: string) {
    await act(async () => {
      fireEvent.click(await this.renderProps!.findByText(title), {
        ctrlKey: true,
      });
    });
  }

  public async controlShiftClick(title: string) {
    await act(async () => {
      fireEvent.click(await this.renderProps!.findByText(title), {
        ctrlKey: true,
        shiftKey: true,
      });
    });
  }

  public async shiftClick(title: string) {
    await act(async () => {
      fireEvent.click(await this.renderProps!.findByText(title), {
        shiftKey: true,
      });
    });
  }

  public async pressKey(key: string, event: Partial<KeyboardEvent> = {}) {
    await act(() => {
      fireEvent.keyDown(document, { key, ...event });
      fireEvent.keyUp(document, { key, ...event });
    });
    await new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }

  public async pressKeys(...keys: string[]) {
    await act(() => {
      for (const key of keys) {
        fireEvent.keyDown(document, { key });
      }
      for (const key of keys) {
        fireEvent.keyUp(document, { key });
      }
    });
    await new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }

  public async startDrag(title: string) {
    await act(async () => {
      fireEvent.dragStart(await this.renderProps!.findByText(title), {
        dataTransfer: {},
      });
    });
  }

  public async dragOver(
    title: string,
    position?: 'top' | 'bottom',
    indent?: number,
    additionalYCoord = 0
  ) {
    await act(async () => {
      const items = await this.renderProps!.findAllByTestId('title');
      const itemIndex = items.findIndex(item => item.innerHTML === title);

      // jsdom doesnt support drag events :( let's mock it directly on the dnd context
      this.environmentRef?.dragAndDropContext.onDragOverTreeHandler(
        {
          clientX: indent !== undefined ? indent * 10 : 9999,
          clientY:
            itemIndex * 10 +
            (position === 'top' ? 1 : position === 'bottom' ? 9 : 5) +
            additionalYCoord,
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

  public async expectFocused(item: string, treeId = 1) {
    await this.expectVisible(item);
    expect(
      this.environmentRef?.viewState[`tree-${treeId}`]?.focusedItem
    ).toEqual(item);
  }

  public async expectSelected(...items: string[]) {
    await this.expectVisible(...items);
    await waitFor(() => {
      expect(this.environmentRef?.viewState['tree-1']?.selectedItems).toEqual(
        items
      );
    });
  }

  public async expectOpenViewState(treeId = 1) {
    const items = Object.keys(buildTestTree());
    await this.expectVisible(...items.filter(item => item !== 'root'));
    expect(
      this.environmentRef?.viewState[`tree-${treeId}`]?.expandedItems
    ).toEqual(items);
  }

  public async expectItemsExpanded(...items: string[]) {
    await this.expectVisible(...items);
    for (const item of items) {
      expect(this.environmentRef?.viewState['tree-1']?.expandedItems).toContain(
        item
      );
    }
  }

  public async expectItemsCollapsed(...items: string[]) {
    for (const item of items) {
      expect(
        this.environmentRef?.viewState['tree-1']?.expandedItems
      ).not.toContain(item);
    }
  }

  public async expectItemContentsUnchanged(...items: string[]) {
    for (const item of items) {
      const originalItems = buildTestTree()[item].children!.map(
        child => `${child}`
      );
      await this.expectItemContents(item, originalItems);
    }
  }

  public async expectItemContentsVisibleAndUnchanged(...items: string[]) {
    for (const item of items) {
      const originalItems = buildTestTree()[item].children!.map(
        child => `${child}`
      );
      await this.expectVisibleItemContents(item, originalItems);
    }
  }

  public async expectItemContents(item: string, contents: string[]) {
    const { children } = await this.dataProvider.getTreeItem(item);
    expect(children).toEqual(contents);
  }

  public async expectTreeUnchanged() {
    for (const [id, item] of Object.entries(buildTestTree())) {
      expect(await this.dataProvider.getTreeItem(id)).toEqual(item);
    }
  }

  public async debugTree() {
    // eslint-disable-next-line no-console
    console.log(await this.retrieveDebugTree());
  }

  private async retrieveDebugTree(
    subtree: string | number = 'root',
    depth = 0
  ) {
    let str = '';
    const { children } = await this.dataProvider.getTreeItem(subtree);
    for (const child of children ?? []) {
      str += `${' '.repeat(depth * 2) + child}\n`;
      str += await this.retrieveDebugTree(child, depth + 1);
    }
    return str;
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
          canDropOnFolder
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
                // eslint-disable-next-line no-param-reassign
                (props as any).containerProps.ref.current = ref;
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
