import type { PluginInput, PluginOutput } from "@varavel/vdl-plugin-sdk";
import { assertValidIrForRpc } from "@varavel/vdl-plugin-sdk/utils/rpc";
import {
  escapeHtml,
  escapeScriptTag,
} from "@varavel/vdl-plugin-sdk/utils/strings";
import { stringify as stringifyYaml } from "@varavel/vdl-plugin-sdk/utils/yaml";
import { type PluginOptions, resolvePluginOptions } from "./options";
import playgroundTemplate from "./playground.html?raw";
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
  const jsonSpec = stringifySpec(spec, "json");
  const files: NonNullable<PluginOutput["files"]> = [
    {
      path: options.outFile,
      content: stringifySpec(spec, options.outFormat),
    },
  ];

  if (options.playgroundFile) {
    files.push({
      path: options.playgroundFile,
      content: renderPlaygroundHtml(options.title, jsonSpec),
    });
  }

  return {
    files,
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

function renderPlaygroundHtml(title: string, jsonSpec: string): string {
  return playgroundTemplate
    .replace("%TITLE%", escapeHtml(title))
    .replace("%OPENAPI_SPEC%", escapeScriptTag(jsonSpec.trim()));
}
