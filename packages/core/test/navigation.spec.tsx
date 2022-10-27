import { act } from '@testing-library/react';
import { TestUtil } from './helpers';

describe('navigation', () => {
  describe('moving focus', () => {
    it('can move focus between items', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('target');
      await test.pressKeys('ArrowDown');
      await test.expectFocused('after');
      await test.pressKeys('ArrowDown');
      await test.expectFocused('a');
      await test.pressKeys('ArrowDown');
      await test.expectFocused('aa');
      await test.pressKeys('ArrowDown');
      await test.expectFocused('aaa');
      await test.pressKeys('ArrowDown');
      await test.expectFocused('aab');
      await test.pressKeys('ArrowDown');
      await test.expectFocused('aac');
      await test.expectTreeUnchanged();
    });

    it('can jump to top and bottom', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('target');
      await test.pressKeys('home');
      await test.expectFocused('target-parent');
      await test.pressKeys('end');
      await test.expectFocused('cannot-rename');
      await test.expectTreeUnchanged();
    });
  });

  describe('opening and closing folders', () => {
    it('can open and close folders', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('target');
      await test.pressKeys('ArrowLeft');
      await test.expectItemsExpanded('target-parent');
      await test.expectFocused('target-parent');
      await test.pressKeys('ArrowLeft');
      await test.expectItemsCollapsed('target-parent');
      await test.expectFocused('target-parent');
      await test.pressKeys('ArrowRight');
      await test.expectItemsExpanded('target-parent');
      await test.expectFocused('target-parent');
      await test.pressKeys('ArrowRight');
      await test.expectFocused('before');
      await test.expectTreeUnchanged();
    });
  });

  describe('expand and collapse all', () => {
    it('can expand and collapse all', async () => {
      const test = await new TestUtil().renderTree();
      await test.waitForStableLinearItems();
      await act(async () => {
        await test.treeRef?.expandAll();
      });
      await test.expectVisible('aaa', 'bbb', 'ccc', 'deep5');
      // await waitFor(async () => {
      //   await test.expectOpenViewState();
      // });
      await act(async () => {
        await test.treeRef?.collapseAll();
      });
      await test.expectNotVisible('aaa', 'aa', 'target', 'deep5');
      await test.expectViewState({
        expandedItems: [],
        focusedItem: 'target-parent',
      });

      await test.expectTreeUnchanged();
    });
  });
});
