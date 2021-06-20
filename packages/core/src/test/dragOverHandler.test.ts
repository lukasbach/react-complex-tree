import * as React from 'react';
import { DraggingPosition, TreeEnvironmentContextProps } from '../types';
import { getItemsLinearly } from '../tree/getItemsLinearly';
import { createOnDragOverHandler, isOutsideOfContainer } from '../tree/createOnDragOverHandler';

// const isOutsideOfContainerMock = jest.fn();
// const getHoveringPositionMock = jest.fn();
let mockHoverPosition: any;

jest.mock('../tree/createOnDragOverHandler.ts', () => ({
  ...jest.requireActual('../tree/createOnDragOverHandler.ts'),
  getHoveringPosition: () => mockHoverPosition,
  isOutsideOfContainer: () => false,
}))

describe('dragOverHandler', function () {
  const mockHoveringPosition = (linearIndex: number, offset: 'top' | 'bottom' | undefined) => {
    mockHoverPosition = { linearIndex, offset };
  };

  const runHandler = () => {
    return createOnDragOverHandler(
      environment,
      containerRef,
      lastHoverCode,
      () => getItemsLinearly(rootItem, environment.viewState, environment.items),
      rootItem,
      treeId,
    )({} as any);
  }

  const onDragAtPositionMock = jest.fn<void, [DraggingPosition | undefined]>();
  const rootItem = 'root';
  const treeId = 'tree1';
  const lastHoverCode = { current: '' };

  const containerRef: React.MutableRefObject<HTMLElement> = {
    current: {
      getBoundingClientRect: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
    } as HTMLElement
  };

  let environment: TreeEnvironmentContextProps;

  const environmentTemplate: TreeEnvironmentContextProps = {
    activeTreeId: treeId,
    allowDragAndDrop: true,
    allowDropOnItemWithChildren: true,
    allowReorderingItems: true,
    items: {root:{index:"root",canMove:!0,hasChildren:!0,children:["container"],data:"root",canRename:!0},container:{index:"container",canMove:!0,hasChildren:!0,children:["item0","item1","item2","item3","item4","item5"],data:"container",canRename:!0},item0:{index:"item0",canMove:!0,hasChildren:!1,data:"item0",canRename:!0},item1:{index:"item1",canMove:!0,hasChildren:!1,data:"item1",canRename:!0},item2:{index:"item2",canMove:!0,hasChildren:!1,data:"item2",canRename:!0},item3:{index:"item3",canMove:!0,hasChildren:!0,children:["inner0","inner1","inner2","inner3"],data:"item3",canRename:!0},item4:{index:"item4",canMove:!0,hasChildren:!1,data:"item4",canRename:!0},item5:{index:"item5",canMove:!0,hasChildren:!1,data:"item5",canRename:!0},inner0:{index:"inner0",canMove:!0,hasChildren:!1,data:"inner0",canRename:!0},inner1:{index:"inner1",canMove:!0,hasChildren:!1,data:"inner1",canRename:!0},inner2:{index:"inner2",canMove:!0,hasChildren:!1,data:"inner2",canRename:!0},inner3:{index:"inner3",canMove:!0,hasChildren:!1,data:"inner3",canRename:!0}},
    viewState: {
      tree1: {
        expandedItems: ['container', 'item3']
      }
    },
    onDragAtPosition: onDragAtPositionMock,
    itemHeight: 10,
    draggingItems: [],
    setActiveTree: () => {},
  } as unknown as TreeEnvironmentContextProps;

  beforeEach(() => {
    // isOutsideOfContainerMock.mockImplementation(() => false);
    environment = {...environmentTemplate};
    lastHoverCode.current = '';
    onDragAtPositionMock.mockReset();
  });

  describe('should move within the same container', () => {
    it('move down, no offset', function () {
      environment.draggingItems = [environment.items['item0']];
      mockHoveringPosition(3, undefined);
      runHandler();
      expect(onDragAtPositionMock).toBeCalledWith({
        targetType: 'item',
        parentItem: 'container',
        depth: 1,
        linearIndex: 3,
        targetItem: 'item3',
        treeId
      } as DraggingPosition)
    });
  });

});