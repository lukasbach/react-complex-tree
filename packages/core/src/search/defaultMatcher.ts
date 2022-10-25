import { TreeItem } from '../types';

export const defaultMatcher: <T = any>(
  search: string,
  item: TreeItem<T>,
  itemTitle: string
) => boolean = (search, item, itemTitle) =>
  itemTitle.toLowerCase().includes(search.toLowerCase());
