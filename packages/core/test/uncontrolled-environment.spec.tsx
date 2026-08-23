import { StaticTreeDataProvider } from '../src';
import { TestUtil } from './helpers';

describe('uncontrolled environment', () => {
  it('writes resolved items when another requested item is missing', async () => {
    const test = new TestUtil();
    test.dataProvider = new StaticTreeDataProvider({
      root: {
        index: 'root',
        isFolder: true,
        children: ['present', 'missing'],
        data: 'root',
      },
      present: {
        index: 'present',
        isFolder: false,
        data: 'present',
      },
    });

    await test.renderTree({
      viewState: { 'tree-1': { expandedItems: ['root'] } },
    });

    await test.expectVisible('present');
    await test.expectNotVisible('missing');
  });
});
