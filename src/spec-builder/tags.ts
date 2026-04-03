import type { RpcGroup } from "../rpc-model";

/**
 * Creates tags using the same naming convention as the legacy generator.
 */
export function buildTags(rpcGroups: RpcGroup[]): Record<string, unknown>[] {
  const tags: Record<string, unknown>[] = [];

  for (const group of rpcGroups) {
    if (group.procedures.length > 0) {
      tags.push({
        name: `${group.name}Procedures`,
        description: group.doc ?? `Procedures for ${group.name}`,
      });
    }

    if (group.streams.length > 0) {
      tags.push({
        name: `${group.name}Streams`,
        description: group.doc ?? `Streams for ${group.name}`,
      });
    }
  }

  tags.sort((left, right) => {
    return String(left.name).localeCompare(String(right.name));
  });

  return tags;
}
