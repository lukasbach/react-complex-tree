import { act } from '@testing-library/react';
import { TestUtil } from './helpers';

// TODO!! live blocks in docs not working anymore?

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

  it('basic dnd test', async () => {
    const test = await new TestUtil().withEverythingOpen().renderTree();
    await test.expectVisible('aaa', 'bbb');
    await test.waitForStableLinearItems();
    await test.startDrag('ab');
    await act(async () => {
      await test.dragOver('b');
    });
    await act(async () => {
      await test.drop();
    });
    test.renderProps!.debug();
    await test.expectVisibleItemContents('a', ['aa', 'ac', 'ad']);
    await test.expectVisibleItemContents('b', ['ba', 'bb', 'bc', 'bd', 'ab']);
  }, 99999999999);
});
