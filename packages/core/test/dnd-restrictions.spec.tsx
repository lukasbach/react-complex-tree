import { TestUtil } from './helpers';

describe('dnd restrictions', () => {
  describe('canDragAndDrop', () => {
    it('respects disabled value', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDragAndDrop: false,
      });
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectTreeUnchanged();
      await test.expectOpenViewState();
    });
  });

  describe('canDropOnFolder', () => {
    it('respects disabled value', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDropOnFolder: false,
      });
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectTreeUnchanged();
      await test.expectOpenViewState();
    });
  });

  describe('canDropOnNonFolder', () => {
    it('respects disabled value', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDropOnNonFolder: false,
      });
      await test.startDrag('aab');
      await test.dragOver('target');
      await test.drop();
      await test.expectTreeUnchanged();
      await test.expectOpenViewState();
    });

    it('works for still valid cases', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDropOnNonFolder: false,
      });
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'aab',
      ]);
      await test.expectOpenViewState();
    });
  });

  describe('canDropAt', () => {
    const canDropAt = jest.fn(
      (items, position) =>
        !(
          items[0].data === 'aab' &&
          position.parentItem === 'root' &&
          position.targetType === 'item'
        )
    );

    beforeEach(() => {
      canDropAt.mockClear();
    });

    it('respects disabled value', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDropAt,
      });
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectTreeUnchanged();
      await test.expectOpenViewState();
      expect(canDropAt).toHaveBeenCalled();
    });

    it('works for different dragged items', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDropAt,
      });
      await test.startDrag('aac');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'aac',
      ]);
      await test.expectOpenViewState();
    });

    it('works for different drop targets', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDropAt,
      });
      await test.startDrag('aab');
      await test.dragOver('cc');
      await test.drop();
      await test.expectVisibleItemContents('cc', [
        'cca',
        'ccb',
        'ccc',
        'ccd',
        'aab',
      ]);
      await test.expectOpenViewState();
    });
  });

  describe('canDrag', () => {
    it('respects disabled value', async () => {
      const canDrag = jest.fn(items => items[0].data !== 'aab');
      const test = await new TestUtil().renderOpenTree({
        canDrag,
      });
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectTreeUnchanged();
      await test.expectOpenViewState();
      expect(canDrag).toHaveBeenCalled();
    });

    it('works for other item', async () => {
      const canDrag = jest.fn(items => items[0].data !== 'aab');
      const test = await new TestUtil().renderOpenTree({
        canDrag,
      });
      await test.startDrag('aac');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'aac',
      ]);
      expect(canDrag).toHaveBeenCalled();
    });
  });

  describe('canReorderItems', () => {
    it('respects disabled value', async () => {
      const test = await new TestUtil().renderOpenTree({
        canReorderItems: false,
      });
      await test.startDrag('aaa');
      await test.dragOver('abb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('ab', [
        'aba',
        'abb',
        'abc',
        'abd',
        'aaa',
      ]);
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectOpenViewState();
    });

    it('dropping on undroppable nonfolder targets parent', async () => {
      const test = await new TestUtil().renderOpenTree({
        canReorderItems: false,
        canDropOnNonFolder: false,
      });
      await test.startDrag('aaa');
      await test.dragOver('aba');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('ab', [
        'aba',
        'abb',
        'abc',
        'abd',
        'aaa',
      ]);
      await test.expectOpenViewState();
    });
  });

  describe('item.canMove', () => {
    it('respects disabled value', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('cannot-move');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectTreeUnchanged();
      await test.expectOpenViewState();
    });
  });
});
