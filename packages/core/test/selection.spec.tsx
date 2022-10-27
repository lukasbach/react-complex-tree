import { TestUtil } from './helpers';

describe('selection', () => {
  describe('selections via mouse', () => {
    it('can select a single item', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target');
      await test.expectFocused('target');
      await test.expectSelected('target');
    });

    it('selects another item when clicking something else', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target');
      await test.clickItem('aaa');
      await test.expectFocused('aaa');
      await test.expectSelected('aaa');
    });

    it('can select multiple with ctrl', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('target');
      await test.controlClick('aaa');
      await test.controlClick('bbb');
      await test.expectFocused('bbb');
      await test.expectSelected('target', 'aaa', 'bbb');
    });

    it.skip('can select region with shift', async () => {
      // TODO
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('aad');
      await test.shiftClick('aba');
      await test.expectFocused('aba');
      await test.expectSelected('aad', 'ab', 'aba');
    });

    it.skip('can select multiple regions with shift', async () => {
      // TODO
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('aaa');
      await test.shiftClick('aac');
      await test.controlClick('aba');
      await test.controlShiftClick('abc');
      await test.expectFocused('abc');
      await test.expectSelected('aaa', 'aab', 'aac', 'aba', 'abb', 'abc');
    });

    it.skip('resets region when control is not clicked next time', async () => {
      // TODO
      const test = await new TestUtil().renderOpenTree();
      await test.clickItem('aaa');
      await test.shiftClick('aac');
      await test.controlClick('aba');
      await test.shiftClick('abc');
      await test.expectFocused('abc');
      await test.expectSelected('aba', 'abb', 'abc');
    });
  });

  describe('selections via keyboard', () => {
    it('can select an item with primary action', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('before');
      await test.pressKeys('ArrowDown');
      await test.pressKeys('Enter');
      await test.expectFocused('target');
      await test.expectSelected('target');
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
    });

    it.skip('can select region', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('before');
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.expectFocused('aa');
      await test.expectSelected('before', 'target', 'after', 'a', 'aa');
    });

    it.skip('can select multiple regions', async () => {
      const test = await new TestUtil().renderOpenTree();
      await test.focusTree();
      await test.clickItem('before');
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown');
      await test.pressKey('ArrowDown');
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.pressKey('ArrowDown', { shiftKey: true });
      await test.expectFocused('aaa');
      await test.expectSelected('before', 'target', 'after', 'aa', 'aaa');
    });
  });
});
