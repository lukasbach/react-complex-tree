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
});
