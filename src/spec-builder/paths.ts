import { pascalCase } from "@varavel/vdl-plugin-sdk/utils/strings";
import type { RpcGroup, RpcOperation } from "../rpc-model";

/**
 * Builds the OpenAPI paths object using the legacy route casing expected by the
 * historical golden files.
 */
export function buildPaths(rpcGroups: RpcGroup[]): Record<string, unknown> {
  const entries: Array<[string, Record<string, unknown>]> = [];

  for (const group of rpcGroups) {
    for (const operation of group.procedures) {
      entries.push([
        `/${group.name}/${operation.name}`,
        {
          post: buildPathOperation(operation),
        },
      ]);
    }

    for (const operation of group.streams) {
      entries.push([
        `/${group.name}/${operation.name}`,
        {
          post: buildPathOperation(operation),
        },
      ]);
    }
  }

  entries.sort((left, right) => left[0].localeCompare(right[0]));

  return entriesToRecord(entries);
}

function buildPathOperation(operation: RpcOperation): Record<string, unknown> {
  const inputName = `${operation.rpcName}${pascalCase(operation.name)}Input`;
  const outputName = `${operation.rpcName}${pascalCase(operation.name)}Output`;
  const openApiOperation: Record<string, unknown> = {
    tags: [
      operation.kind === "procedure"
        ? `${operation.rpcName}Procedures`
        : `${operation.rpcName}Streams`,
    ],
    requestBody: {
      $ref: `#/components/requestBodies/${inputName}`,
    },
    responses: {
      200: {
        $ref: `#/components/responses/${outputName}`,
      },
    },
  };

  if (operation.doc) {
    openApiOperation.description = operation.doc;
  }

  if (operation.deprecated) {
    openApiOperation.deprecated = true;
  }

  return openApiOperation;
}

function entriesToRecord(
  entries: Array<[string, unknown]>,
): Record<string, unknown> {
  const record: Record<string, unknown> = {};

  for (const [key, value] of entries) {
    record[key] = value;
  }

  return record;
}
