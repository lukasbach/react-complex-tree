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
      await test.dragOver('b');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aaa', 'aac', 'aad']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'bc',
        'bd',
        'aab',
      ]);
    });

    it('drag folder into another opened folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('ab');
      await test.dragOver('b');
      await test.drop();
      await test.expectVisibleItemContents('a', ['aa', 'ac', 'ad']);
      await test.expectVisibleItemContents('b', ['ba', 'bb', 'bc', 'bd', 'ab']);
    });

    it('drag folder into another closed folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('b');
      await test.expectNotVisible('ba');
      await test.startDrag('ab');
      await test.dragOver('b');
      await test.drop();
      await test.expectNotVisible('ba', 'ab');
      await test.expectItemContents('a', ['aa', 'ac', 'ad']);
      await test.expectItemContents('b', ['ba', 'bb', 'bc', 'bd', 'ab']);
      await test.clickItem('b');
      await test.expectVisibleItemContents('a', ['aa', 'ac', 'ad']);
      await test.expectVisibleItemContents('b', ['ba', 'bb', 'bc', 'bd', 'ab']);
    });

    it('drag item to item top', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('bbb', 'top');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('bb', [
        'bba',
        'aaa',
        'bbb',
        'bbc',
        'bbd',
      ]);
    });

    it('drag item to item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'aaa',
        'bc',
        'bd',
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

    it('drag item to open folder bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
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
      await test.dragOver('bb');
      await test.stopDrag();
      await test.expectVisibleItemContents('aa', ['aaa', 'aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('b', ['ba', 'bb', 'bc', 'bd']);
    });

    it('drags another item than selected if not ctrl-clicked', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('ccc');
      await test.startDrag('aab');
      await test.dragOver('b');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aaa', 'aac', 'aad']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'bc',
        'bd',
        'aab',
      ]);
    });
  });

  describe('dragging multiple items', () => {
    it('drag items into another folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aab', 'aac', 'aad');
      await test.startDrag('aab');
      await test.dragOver('b');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aaa']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'bc',
        'bd',
        'aab',
        'aac',
        'aad',
      ]);
    });

    it('drag folders into another opened folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('ab', 'ac', 'ad');
      await test.startDrag('ab');
      await test.dragOver('b');
      await test.drop();
      await test.expectVisibleItemContents('a', ['aa']);
      await test.expectItemContents('ab', ['aba', 'abb', 'abc', 'abd']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'bc',
        'bd',
        'ab',
        'ac',
        'ad',
      ]);
    });

    it('drag folders into another closed folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('b');
      await test.expectNotVisible('ba');
      await test.selectItems('ab', 'ac', 'ad');
      await test.startDrag('ab');
      await test.dragOver('b');
      await test.drop();
      await test.expectNotVisible('ba', 'ab', 'ac', 'ad');
      await test.expectItemContents('a', ['aa']);
      await test.expectItemContents('b', [
        'ba',
        'bb',
        'bc',
        'bd',
        'ab',
        'ac',
        'ad',
      ]);
      await test.clickItem('b');
      await test.expectVisibleItemContents('a', ['aa']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'bc',
        'bd',
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
      await test.dragOver('ccc', 'top');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bba', 'bbc', 'bbd']);
      await test.expectVisibleItemContents('cc', [
        'cca',
        'ccb',
        'aaa',
        'aab',
        'bbb',
        'ccc',
        'ccd',
      ]);
    });

    // TODO adapt tests below to multi-dnd, they are still copies from above
    it('drag item to item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('b', [
        'ba',
        'bb',
        'aaa',
        'bc',
        'bd',
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

    it('drag item to open folder bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
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
      await test.dragOver('bb');
      await test.stopDrag();
      await test.expectVisibleItemContents('aa', ['aaa', 'aab', 'aac', 'aad']);
      await test.expectVisibleItemContents('b', ['ba', 'bb', 'bc', 'bd']);
    });
  });
});
