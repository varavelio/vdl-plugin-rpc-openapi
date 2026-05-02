import type { PluginInput, PluginOutput } from "@varavel/vdl-plugin-sdk";
import { assertValidIrForRpc } from "@varavel/vdl-plugin-sdk/utils/rpc";
import {
  escapeHtml,
  escapeScriptTag,
} from "@varavel/vdl-plugin-sdk/utils/strings";
import { stringify as stringifyYaml } from "@varavel/vdl-plugin-sdk/utils/yaml";
import { type PluginOptions, resolvePluginOptions } from "./options";
import playgroundElementsTemplate from "./playground-elements.html?raw";
import playgroundScalarTemplate from "./playground-scalar.html?raw";
import playgroundSwaggerTemplate from "./playground-swagger.html?raw";
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
      content: renderPlaygroundHtml(options, jsonSpec),
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

function renderPlaygroundHtml(
  options: PluginOptions,
  jsonSpec: string,
): string {
  if (options.playgroundUi === "scalar") {
    return playgroundScalarTemplate
      .replace("%TITLE%", escapeHtml(options.title))
      .replace(
        "%OPENAPI_CONTENT%",
        escapeScriptTag(JSON.stringify(jsonSpec.trim())),
      );
  }

  if (options.playgroundUi === "elements") {
    return playgroundElementsTemplate
      .replace("%TITLE%", escapeHtml(options.title))
      .replace("%OPENAPI_SPEC%", escapeScriptTag(jsonSpec.trim()));
  }

  return playgroundSwaggerTemplate
    .replace("%TITLE%", escapeHtml(options.title))
    .replace("%OPENAPI_SPEC%", escapeScriptTag(jsonSpec.trim()));
}
