import { TreeItem, TreeItemIndex } from '../../src';

type ConvenientItem = Omit<Partial<TreeItem<string>>, 'children'>;
type ConvenientItemData = Omit<TreeItem<string>, 'children'> & {
  children?: ConvenientItemData[];
};

const buildItem = (
  index: TreeItemIndex,
  children?: ConvenientItemData[],
  props: ConvenientItem = {}
): ConvenientItemData => ({
  index,
  isFolder: props.isFolder ?? !!children,
  children,
  canMove: true,
  canRename: true,
  ...props,
  data: `${index}`,
});

const template = buildItem('root', [
  buildItem('target-parent', [
    buildItem('before'),
    buildItem('target'),
    buildItem('after'),
  ]),
  buildItem('a', [
    buildItem('aa', [
      buildItem('aaa'),
      buildItem('aab'),
      buildItem('aac'),
      buildItem('aad'),
    ]),
    buildItem('ab', [
      buildItem('aba'),
      buildItem('abb'),
      buildItem('abc'),
      buildItem('abd'),
    ]),
    buildItem('ac', [
      buildItem('aca'),
      buildItem('acb'),
      buildItem('acc'),
      buildItem('acd'),
    ]),
    buildItem('ad', [
      buildItem('ada'),
      buildItem('adb'),
      buildItem('adc'),
      buildItem('add'),
    ]),
  ]),
  buildItem('b', [
    buildItem('ba', [
      buildItem('baa'),
      buildItem('bab'),
      buildItem('bac'),
      buildItem('bad'),
    ]),
    buildItem('bb', [
      buildItem('bba'),
      buildItem('bbb'),
      buildItem('bbc'),
      buildItem('bbd'),
    ]),
    buildItem('bc', [
      buildItem('bca'),
      buildItem('bcb'),
      buildItem('bcc'),
      buildItem('bcd'),
    ]),
    buildItem('bd', [
      buildItem('bda'),
      buildItem('bdb'),
      buildItem('bdc'),
      buildItem('bdd'),
    ]),
  ]),
  buildItem('c', [
    buildItem('ca', [
      buildItem('caa'),
      buildItem('cab'),
      buildItem('cac'),
      buildItem('cad'),
    ]),
    buildItem('cb', [
      buildItem('cba'),
      buildItem('cbb'),
      buildItem('cbc'),
      buildItem('cbd'),
    ]),
    buildItem('cc', [
      buildItem('cca'),
      buildItem('ccb'),
      buildItem('ccc'),
      buildItem('ccd'),
    ]),
    buildItem('cd', [
      buildItem('cda'),
      buildItem('cdb'),
      buildItem('cdc'),
      buildItem('cdd'),
    ]),
  ]),
  buildItem('deep1', [
    buildItem('deep2', [
      buildItem('deep3', [buildItem('deep4', [buildItem('deep5')])]),
    ]),
  ]),
  buildItem('special', [
    buildItem('cannot-move', undefined, { canMove: false }),
    buildItem('cannot-rename', undefined, { canRename: false }),
  ]),
]);

const readTemplate = (
  templateData: ConvenientItemData[],
  data: Record<TreeItemIndex, TreeItem<string>> = {}
) => {
  for (const item of templateData) {
    // eslint-disable-next-line no-param-reassign
    data[item.index] = {
      ...item,
      children: item.children?.map(child => child.index),
    };

    if (item.children) {
      readTemplate(item.children, data);
    }
  }
  return data;
};

export const buildTestTree = () => readTemplate([template]);
