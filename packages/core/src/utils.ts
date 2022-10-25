export const buildMapForTrees = <T extends any>(
  treeIds: string[],
  build: (treeId: string) => T
): { [treeId: string]: T } =>
  treeIds
    .map(id => [id, build(id)] as const)
    .reduce((a, [id, obj]) => ({ ...a, [id]: obj }), {});
