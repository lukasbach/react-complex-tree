import { render, fireEvent, act } from '@testing-library/react';
import React from 'react';
import {
  TreeEnvironmentRef,
  TreeRef,
  UncontrolledTreeEnvironmentProps,
} from 'react-complex-tree';
import {
  Tree,
  TreeItem,
  TreeItemIndex,
  TreeViewState,
  StaticTreeDataProvider,
  UncontrolledTreeEnvironment,
  TreeProps,
  IndividualTreeViewState,
} from '../src';

import '@testing-library/jest-dom';

type ConvenientItem = Omit<Partial<TreeItem<string>>, 'children'>;
type ConvenientItemData = Omit<TreeItem<string>, 'children'> & {
  children?: ConvenientItemData[];
};

const buildItem = (
  index: TreeItemIndex,
  children?: ConvenientItemData[],
  props: ConvenientItem = {}
): ConvenientItemData => ({
  index,
  hasChildren: props.hasChildren ?? !!children,
  children,
  canMove: true,
  canRename: true,
  ...props,
  data: `${index}`,
});

const template = buildItem('root', [
  buildItem('a', [
    buildItem('aa', [
      buildItem('aaa'),
      buildItem('aab'),
      buildItem('aac'),
      buildItem('aad'),
    ]),
    buildItem('ab', [
      buildItem('aba'),
      buildItem('abb'),
      buildItem('abc'),
      buildItem('abd'),
    ]),
    buildItem('ac', [
      buildItem('aca'),
      buildItem('acb'),
      buildItem('acc'),
      buildItem('acd'),
    ]),
    buildItem('ad', [
      buildItem('ada'),
      buildItem('adb'),
      buildItem('adc'),
      buildItem('add'),
    ]),
  ]),
  buildItem('b', [
    buildItem('ba', [
      buildItem('baa'),
      buildItem('bab'),
      buildItem('bac'),
      buildItem('bad'),
    ]),
    buildItem('bb', [
      buildItem('bba'),
      buildItem('bbb'),
      buildItem('bbc'),
      buildItem('bbd'),
    ]),
    buildItem('bc', [
      buildItem('bca'),
      buildItem('bcb'),
      buildItem('bcc'),
      buildItem('bcd'),
    ]),
    buildItem('bd', [
      buildItem('bda'),
      buildItem('bdb'),
      buildItem('bdc'),
      buildItem('bdd'),
    ]),
  ]),
  buildItem('c', [
    buildItem('ca', [
      buildItem('caa'),
      buildItem('cab'),
      buildItem('cac'),
      buildItem('cad'),
    ]),
    buildItem('cb', [
      buildItem('cba'),
      buildItem('cbb'),
      buildItem('cbc'),
      buildItem('cbd'),
    ]),
    buildItem('cc', [
      buildItem('cca'),
      buildItem('ccb'),
      buildItem('ccc'),
      buildItem('ccd'),
    ]),
    buildItem('cd', [
      buildItem('cda'),
      buildItem('cdb'),
      buildItem('cdc'),
      buildItem('cdd'),
    ]),
  ]),
  buildItem('special', [
    buildItem('cannot-move', undefined, { canMove: false }),
    buildItem('cannot-rename', undefined, { canRename: false }),
  ]),
]);

const readTemplate = (
  templateData: ConvenientItemData[],
  data: Record<TreeItemIndex, TreeItem<string>> = {}
) => {
  for (const item of templateData) {
    data[item.index] = {
      ...item,
      children: item.children?.map(child => child.index),
    };

    if (item.children) {
      readTemplate(item.children, data);
    }
  }
  return data;
};

const testTree = readTemplate([template]);

export class TestUtil {
  private viewState: TreeViewState = {};

  public renderProps?: ReturnType<typeof render>;

  public environmentRef?: TreeEnvironmentRef | null;

  public treeRef?: TreeRef | null;

  public tree2Ref?: TreeRef | null;

  public withViewState(viewState: TreeViewState) {
    this.viewState = viewState;
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

  public async expectVisible(...items: (string | number | undefined)[]) {
    await Promise.all(
      items
        .filter(item => item)
        .map(async item =>
          expect(
            await this.renderProps!.findByText(`${item}`)
          ).toBeInTheDocument()
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

  public async renderTree(
    environmentProps: Partial<UncontrolledTreeEnvironmentProps> = {},
    treeProps: Partial<TreeProps> = {},
    tree2Props: Partial<TreeProps> = {},
    twoTrees = false
  ) {
    await act(() => {
      this.renderProps = render(
        <>
          <div>HGello</div>
          <UncontrolledTreeEnvironment
            canDragAndDrop
            canDropOnItemWithChildren
            canReorderItems
            viewState={this.viewState}
            getItemTitle={item => item.data}
            dataProvider={
              new StaticTreeDataProvider(testTree, (item, data) => ({
                ...item,
                data,
              }))
            }
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
        </>
      );
    });
    return this;
  }
}
