import type { IrSchema } from "@varavel/vdl-plugin-sdk";
import type { PluginOptions } from "../options";
import type { RpcGroup } from "../rpc-model";
import { buildComponents } from "./components";
import { buildInfo } from "./info";
import { buildPaths } from "./paths";
import {
  generateEnumSchema,
  generatePropertiesFromFields,
  generateTypeRefSchema,
  generateTypeSchema,
} from "./schema-fragments";
import { buildTags } from "./tags";

export type OpenApiSpec = Record<string, unknown>;

/**
 * Builds the complete OpenAPI document from IR plus resolved plugin options.
 */
export function buildOpenApiSpec(
  ir: IrSchema,
  rpcGroups: RpcGroup[],
  options: PluginOptions,
): OpenApiSpec {
  const spec: OpenApiSpec = {
    openapi: "3.0.0",
    info: buildInfo(options),
    security: [{ AuthToken: [] }],
  };

  if (options.baseUrl) {
    spec.servers = [{ url: options.baseUrl }];
  }

  const tags = buildTags(rpcGroups);

  if (tags.length > 0) {
    spec.tags = tags;
  }

  const paths = buildPaths(rpcGroups);

  if (Object.keys(paths).length > 0) {
    spec.paths = paths;
  }

  spec.components = buildComponents(ir, rpcGroups);

  return spec;
}

export {
  buildTags,
  generateEnumSchema,
  generatePropertiesFromFields,
  generateTypeRefSchema,
  generateTypeSchema,
};
