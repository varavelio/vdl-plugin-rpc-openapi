import type { PluginInput, PluginOutput } from "@varavel/vdl-plugin-sdk";
import { assertValidIrForRpc } from "@varavel/vdl-plugin-sdk/utils/rpc";
import { stringify as stringifyYaml } from "@varavel/vdl-plugin-sdk/utils/yaml";
import { type PluginOptions, resolvePluginOptions } from "./options";
import { extractRpcGroups } from "./rpc-model";
import { buildOpenApiSpec } from "./spec-builder";

/**
 * Generates a single OpenAPI file (YAML or JSON) from a VDL schema.
 */
export function generateOpenApi(input: PluginInput): PluginOutput {
  const options = resolvePluginOptions(input.options);
  assertValidIrForRpc(input.ir);

  const rpcGroups = extractRpcGroups(input.ir);
  const spec = buildOpenApiSpec(input.ir, rpcGroups, options);

  return {
    files: [
      {
        path: options.outFile,
        content: stringifySpec(spec, options.outFormat),
      },
    ],
  };
}

/**
 * Marshal the file output in JSON or YAML format based on the needed output format.
 */
function stringifySpec(
  spec: unknown,
  outFormat: PluginOptions["outFormat"],
): string {
  if (outFormat === "json") {
    return `${JSON.stringify(spec, null, 2)}\n`;
  }
  return stringifyYaml(spec);
}
