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
});
