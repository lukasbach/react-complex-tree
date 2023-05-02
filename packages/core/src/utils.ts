export const buildMapForTrees = <T>(
  treeIds: string[],
  build: (treeId: string) => T
): { [treeId: string]: T } =>
  treeIds
    .map(id => [id, build(id)] as const)
    .reduce((a, [id, obj]) => ({ ...a, [id]: obj }), {});

export const getDocument = () =>
  typeof document !== 'undefined' ? document : undefined;
