import { TestUtil } from './helpers';

describe('basic dnd', () => {
  it('can open and close items', async () => {
    const test = await new TestUtil().renderTree();
    await test.clickItem('a');
    await test.clickItem('aa');
    await test.clickItem('b');
    await test.expectViewState({
      expandedItems: ['a', 'aa', 'b'],
      focusedItem: 'b',
      selectedItems: ['b'],
    });
    await test.expectVisible('aaa');
    await test.clickItem('a');
    await test.expectViewState({
      expandedItems: ['aa', 'b'],
      focusedItem: 'a',
      selectedItems: ['a'],
    });
    await test.expectNotVisible('aa', 'aaa');
  });

  describe('dragging single items', () => {
    it('drag item into another folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aaa', 'aac', 'aad']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'aab',
      ]);
    });

    it('drag folder into another opened folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('ab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('a', ['aa', 'ac', 'ad']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'ab',
      ]);
    });

    it('drag folder into another closed folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target-parent');
      await test.expectNotVisible('target');
      await test.startDrag('ab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectNotVisible('target', 'ab');
      await test.expectItemContents('a', ['aa', 'ac', 'ad']);
      await test.expectItemContents('target-parent', [
        'before',
        'target',
        'after',
        'ab',
      ]);
      await test.clickItem('target-parent');
      await test.expectVisibleItemContents('a', ['aa', 'ac', 'ad']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'ab',
      ]);
    });

    it('drag item to item top', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('target', 'top');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'aaa',
        'target',
        'after',
      ]);
    });

    it('drag item to item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('target', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'aaa',
        'after',
      ]);
    });

    it('drag item to open-folder-item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bba', 'bbb', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'aaa',
        'bc',
        'bd',
      ]);
    });

    it('drag item to closed-folder-item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('bb');
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectItemContents('bb', ['bba', 'bbb', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'aaa',
        'bc',
        'bd',
      ]);
    });

    it('cancels drag for dragged item', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('target-parent');
      await test.stopDrag();
      await test.expectVisibleItemContents('aa', ['aaa', 'aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
      ]);
    });

    it('drags another item than selected if not ctrl-clicked', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('ccc');
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aaa', 'aac', 'aad']);
      await test.expectVisibleItemContents('cc', ['cca', 'ccb', 'ccc', 'ccd']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'aab',
      ]);
    });
  });

  describe('dragging multiple items', () => {
    it('drag items into another folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aab', 'aac', 'aad');
      await test.startDrag('aab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aaa']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'aab',
        'aac',
        'aad',
      ]);
    });

    it('drag folders into another opened folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('ab', 'ac', 'ad');
      await test.startDrag('ab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('a', ['aa']);
      await test.expectItemContents('ab', ['aba', 'abb', 'abc', 'abd']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'ab',
        'ac',
        'ad',
      ]);
    });

    it('drag folders into another closed folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target-parent');
      await test.expectNotVisible('target');
      await test.selectItems('ab', 'ac', 'ad');
      await test.startDrag('ab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectNotVisible('target', 'ab', 'ac', 'ad');
      await test.expectItemContents('a', ['aa']);
      await test.expectItemContents('target-parent', [
        'before',
        'target',
        'after',
        'ab',
        'ac',
        'ad',
      ]);
      await test.clickItem('target-parent');
      await test.expectVisibleItemContents('a', ['aa']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
        'ab',
        'ac',
        'ad',
      ]);
    });

    // TODO edit multiple-item cases above to drag items from different folders (aaa, aab, bbb)
    it.skip('drag item to item top', async () => {
      // TODO test is correct, code needs fix
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aaa', 'aab', 'bbb');
      await test.startDrag('aaa');
      await test.dragOver('target', 'top');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bba', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'aaa',
        'aab',
        'bbb',
        'target',
        'after',
      ]);
    });

    it.skip('drag items to item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aaa', 'aab', 'bbb');
      await test.startDrag('aaa');
      await test.dragOver('target', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bba', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'aaa',
        'aab',
        'bbb',
        'after',
      ]);
    });

    it.skip('drag items to open-folder-item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aaa', 'aab', 'bbb');
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bba', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'aaa',
        'aab',
        'bbb',
        'bc',
        'bd',
      ]);
    });

    it('drag items to closed-folder-item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('bb');
      await test.selectItems('aaa', 'aab', 'bbb');
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aac', 'aad']);
      await test.expectItemContents('bb', ['bba', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'aaa',
        'aab',
        'bbb',
        'bc',
        'bd',
      ]);
    });

    it('cancels drag for dragged item', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.selectItems('aaa', 'aab', 'bbb');
      await test.dragOver('target-parent');
      await test.stopDrag();
      await test.expectVisibleItemContents('aa', ['aaa', 'aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bbb', 'bba', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
      ]);
    });
  });
});
