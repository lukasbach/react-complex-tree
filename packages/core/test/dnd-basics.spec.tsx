import { TestUtil } from './helpers';

describe('dnd basics', () => {
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
      await test.expectVisibleItemContents('bb', [
        'aaa',
        'bba',
        'bbb',
        'bbc',
        'bbd',
      ]);
      await test.expectVisibleItemContents('b', ['ba', 'bb', 'bc', 'bd']);
    });

    it('drag item to open-folder-item bottom with canDropBelowOpenFolders', async () => {
      const test = await new TestUtil().renderOpenTree({
        canDropBelowOpenFolders: true,
      });
      await test.startDrag('aaa');
      await test.dragOver('bb', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad']);
      await test.expectItemContentsVisibleAndUnchanged('bb');
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
      await test.expectItemContentsUnchanged('bb');
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
      await test.expectItemContentsVisibleAndUnchanged('aa');
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
      await test.expectItemContentsVisibleAndUnchanged('cc');
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

    it('drag items with scrambled order into another folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aac', 'aad', 'aab');
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

    it('drag items with scrambled order below in same folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aac', 'aaa', 'aab');
      await test.startDrag('aab');
      await test.dragOver('aad', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aad', 'aaa', 'aab', 'aac']);
    });

    it('drag items with scrambled order above in same folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('aac', 'aad', 'aab');
      await test.startDrag('aab');
      await test.dragOver('aaa', 'top');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aab', 'aac', 'aad', 'aaa']);
    });

    it('drag folders into another opened folder', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.selectItems('ab', 'ac', 'ad');
      await test.startDrag('ab');
      await test.dragOver('target-parent');
      await test.drop();
      await test.expectVisibleItemContents('a', ['aa']);
      await test.expectItemContentsUnchanged('ab');
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
      await test.dragOver('cc', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bba', 'bbc', 'bbd']);
      await test.expectItemContentsVisibleAndUnchanged('cc');
      await test.expectVisibleItemContents('c', [
        'ca',
        'cb',
        'cc',
        'aaa',
        'aab',
        'bbb',
        'cd',
      ]);
    });

    it.skip('drag items to closed-folder-item bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('cc');
      await test.selectItems('aaa', 'aab', 'bbb');
      await test.startDrag('aaa');
      await test.dragOver('cc', 'bottom');
      await test.drop();
      await test.expectVisibleItemContents('aa', ['aac', 'aad']);
      await test.expectVisibleItemContents('bb', ['bba', 'bbc', 'bbd']);
      await test.expectItemContentsUnchanged('cc');
      await test.expectVisibleItemContents('c', [
        'ca',
        'cb',
        'cc',
        'aaa',
        'aab',
        'cbb',
        'cd',
      ]);
    });

    it('cancels drag for dragged item', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('aaa');
      await test.selectItems('aaa', 'aab', 'bbb');
      await test.dragOver('target-parent');
      await test.stopDrag();
      await test.expectItemContentsVisibleAndUnchanged('aa', 'bb');
      await test.expectVisibleItemContents('target-parent', [
        'before',
        'target',
        'after',
      ]);
    });

    it('cant drop items on its own descendants', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('a');
      await test.selectItems('a', 'b');
      await test.startDrag('a');
      await test.dragOver('bb');
      await test.drop();
      await test.expectTreeUnchanged();
      await test.expectItemContentsVisibleAndUnchanged('a', 'b', 'bb');
    });
  });

  describe('special drop positions', () => {
    it.each([0, 5, 10, 15, 20, 30, 40])(
      'drops at very bottom +%ipx',
      async offset => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('target');
        await test.dragOver('cannot-rename', 'bottom', 20, offset);
        await test.drop();
        await test.expectVisibleItemContents('special', [
          'cannot-move',
          'cannot-rename',
          'target',
        ]);
      }
    );

    it('doesnt allow dropping into itself', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('a');
      await test.dragOver('aa');
      await test.drop();
      await test.expectTreeUnchanged();
    });

    it('doesnt allow dropping into itself 2', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.startDrag('a');
      await test.dragOver('aac', 'bottom');
      await test.drop();
      await test.expectTreeUnchanged();
    });

    describe('reparent upwards', () => {
      it('doesnt reparent in the on normal item', async () => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('bbb');
        await test.dragOver('aac', 'bottom', 0);
        await test.drop();
        await test.expectItemContentsUnchanged('a', 'b');
        await test.expectItemContents('aa', [
          'aaa',
          'aab',
          'aac',
          'bbb',
          'aad',
        ]);
      });

      it('doesnt reparent in the middle of a subtree', async () => {
        const test = await new TestUtil().renderTree();
        await test.clickItem('a');
        await test.clickItem('target-parent');
        await test.startDrag('target');
        await test.dragOver('ab', 'bottom', 0);
        await test.drop();
        await test.expectItemContentsUnchanged('ab', 'ac', 'root');
        await test.expectItemContents('a', ['aa', 'ab', 'target', 'ac', 'ad']);
      });

      it('doesnt reparent at the top of a subtree', async () => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('bbb');
        await test.dragOver('aaa', 'top', 0);
        await test.drop();
        await test.expectItemContentsUnchanged('a', 'b');
        await test.expectItemContents('aa', [
          'bbb',
          'aaa',
          'aab',
          'aac',
          'aad',
        ]);
      });

      it('doesnt reparent into itself', async () => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('a');
        await test.dragOver('aad', 'bottom', 3);
        await test.drop();
        await test.expectTreeUnchanged();
      });

      it('reparents inner level', async () => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('bbb');
        await test.dragOver('add', 'bottom', 2);
        await test.drop();
        await test.expectItemContentsUnchanged('a', 'b', 'root');
        await test.expectItemContents('ad', [
          'ada',
          'adb',
          'adc',
          'add',
          'bbb',
        ]);
      });

      it('reparents mid level', async () => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('bbb');
        await test.dragOver('add', 'bottom', 1);
        await test.drop();
        await test.expectItemContentsUnchanged('ad', 'b', 'root');
        await test.expectItemContents('a', ['aa', 'ab', 'ac', 'ad', 'bbb']);
      });

      it('reparents outer level', async () => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('bbb');
        await test.dragOver('add', 'bottom', 0);
        await test.drop();
        await test.expectItemContentsUnchanged('ad', 'a', 'b');
        await test.expectItemContents('root', [
          'target-parent',
          'a',
          'bbb',
          'b',
          'c',
          'deep1',
          'special',
        ]);
      });

      it('reparents bottom-most nested item', async () => {
        const test = await new TestUtil().renderOpenTree();
        await test.startDrag('special');
        await test.dragOver('deep5', 'bottom', 10);
        await test.drop();
        await test.expectVisibleItemContents('deep4', ['deep5', 'special']);

        await new Promise(r => {
          setTimeout(r);
        });

        await test.startDrag('special');
        await test.dragOver('cannot-rename', 'bottom', 3);
        await test.drop();
        await test.expectVisibleItemContents('deep4', ['deep5']);
        await test.expectVisibleItemContents('deep3', ['deep4', 'special']);

        await new Promise(r => {
          setTimeout(r);
        });

        await test.startDrag('special');
        await test.dragOver('cannot-rename', 'bottom', 0);
        await test.drop();
        await test.expectVisibleItemContents('deep3', ['deep4']);
        await test.expectItemContents('root', [
          'target-parent',
          'a',
          'b',
          'c',
          'deep1',
          'special',
        ]);
      });

      describe('reparent upwards when dragging at top of item below subtree', () => {
        it('reparents inner level', async () => {
          const test = await new TestUtil().renderOpenTree();
          await test.startDrag('bbb');
          await test.dragOver('b', 'top', 2);
          await test.drop();
          await test.expectItemContentsUnchanged('a', 'b', 'root');
          await test.expectItemContents('ad', [
            'ada',
            'adb',
            'adc',
            'add',
            'bbb',
          ]);
        });

        it('reparents mid level', async () => {
          const test = await new TestUtil().renderOpenTree();
          await test.startDrag('bbb');
          await test.dragOver('b', 'top', 1);
          await test.drop();
          await test.expectItemContentsUnchanged('ad', 'b', 'root');
          await test.expectItemContents('a', ['aa', 'ab', 'ac', 'ad', 'bbb']);
        });

        it('reparents outer level', async () => {
          const test = await new TestUtil().renderOpenTree();
          await test.startDrag('bbb');
          await test.dragOver('b', 'top', 0);
          await test.drop();
          await test.expectItemContentsUnchanged('ad', 'a', 'b');
          await test.expectItemContents('root', [
            'target-parent',
            'a',
            'bbb',
            'b',
            'c',
            'deep1',
            'special',
          ]);
        });
      });
    });

    describe('redirects to parent', () => {
      it('should redirect to parent of canReorderItems is disabled', async () => {
        const test = await new TestUtil().renderOpenTree({
          canReorderItems: false,
        });
        await test.startDrag('target');
        await test.dragOver('aab', 'bottom');
        await test.drop();
        await test.expectItemContents('aa', [
          'aaa',
          'aab',
          'aac',
          'aad',
          'target',
        ]);
      });

      it('should not redirect to parent of canReorderItems is enabled', async () => {
        const test = await new TestUtil().renderOpenTree({
          canReorderItems: true,
        });
        await test.startDrag('target');
        await test.dragOver('aab', 'bottom');
        await test.drop();
        await test.expectItemContents('aa', [
          'aaa',
          'aab',
          'target',
          'aac',
          'aad',
        ]);
      });
    });

    describe('redirects inside open folder', () => {
      it('redirects inside open folder when dropping at bottom of open folder if disabled', async () => {
        const test = await new TestUtil().renderOpenTree({});
        await test.startDrag('target');
        await test.dragOver('aa', 'bottom');
        await test.drop();
        await test.expectItemContentsUnchanged('a');
        await test.expectItemContents('aa', [
          'target',
          'aaa',
          'aab',
          'aac',
          'aad',
        ]);
      });

      it('doesnt redirects inside open folder when enabled', async () => {
        const test = await new TestUtil().renderOpenTree({
          canDropBelowOpenFolders: true,
        });
        await test.startDrag('target');
        await test.dragOver('aa', 'bottom');
        await test.drop();
        await test.expectItemContentsUnchanged('aa');
        await test.expectItemContents('a', ['aa', 'target', 'ab', 'ac', 'ad']);
      });
    });
  });
});
