import { TestUtil } from './helpers';

describe('selection', () => {
  describe('selections via mouse', () => {
    it('can select a single item', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target');
      await test.expectFocused('target');
      await test.expectSelected('target');
      await test.expectTreeUnchanged();
    });

    it('selects another item when clicking something else', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target');
      await test.clickItem('aaa');
      await test.expectFocused('aaa');
      await test.expectSelected('aaa');
      await test.expectTreeUnchanged();
    });

    it('can select multiple with ctrl', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target');
      await test.controlClick('aaa');
      await test.controlClick('bbb');
      await test.expectFocused('bbb');
      await test.expectSelected('target', 'aaa', 'bbb');
      await test.expectTreeUnchanged();
    });

    it('can select region with shift', async () => {
      // TODO
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('aad');
      await test.shiftClick('aba');
      await test.expectFocused('aba');
      await test.expectSelected('aad', 'ab', 'aba');
      await test.expectTreeUnchanged();
    });

    it('can select multiple regions with shift', async () => {
      // TODO
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('aaa');
      await test.shiftClick('aac');
      await test.controlClick('aba');
      await test.controlShiftClick('abc');
      await test.expectFocused('abc');
      await test.expectSelected('aaa', 'aab', 'aac', 'aba', 'abb', 'abc');
      await test.expectTreeUnchanged();
    });

    it('resets region when control is not clicked next time', async () => {
      // TODO
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('aaa');
      await test.shiftClick('aac');
      await test.controlClick('aba');
      await test.shiftClick('abc');
      await test.expectFocused('abc');
      await test.expectSelected('aba', 'abb', 'abc');
      await test.expectTreeUnchanged();
    });
  });

  describe('selections via keyboard', () => {
    // TODO add tests for moving upwards (both keyboard and mouse)

    it('can select an item with primary action', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('before');
      await test.pressKeys('ArrowDown');
      await test.pressKeys('Enter');
      await test.expectFocused('target');
      await test.expectSelected('target');
      await test.expectTreeUnchanged();
    });

    it('can select all', async () => {
      const test = await new TestUtil().renderTree();
      await test.expectVisible('target-parent');
      await test.focusTree();
      await test.clickItem('target-parent');
      await test.pressKeys('control', 'a');
      await test.expectFocused('target-parent');
      await test.expectSelected(
        'target-parent',
        'before',
        'target',
        'after',
        'a',
        'b',
        'c',
        'deep1',
        'special'
      );
      await test.expectTreeUnchanged();
    });

    it('can select multiple with ctrl+space', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('before');
      await test.pressKeys('ArrowDown');
      await test.pressKeys('Control', 'Space');
      await test.pressKeys('ArrowDown');
      await test.pressKeys('Control', 'Space');
      await test.pressKeys('ArrowDown');
      await test.pressKeys('ArrowDown');
      await test.pressKeys('Control', 'Space');
      await test.expectFocused('aa');
      await test.expectSelected('before', 'target', 'after', 'aa');
      await test.expectTreeUnchanged();
    });

    it('can select region', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('before');
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.expectFocused('aa');
      await test.expectSelected('before', 'target', 'after', 'a', 'aa');
      await test.expectTreeUnchanged();
    });

    it.skip('can select multiple regions', async () => {
      // TODO production bug, test is correct
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('before');
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown');
      await test.pressKey('ArrowDown');
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.expectFocused('aab');
      await test.expectSelected(
        'before',
        'target',
        'after',
        'aa',
        'aaa',
        'aab'
      );
      await test.expectTreeUnchanged();
    });
  });
});
