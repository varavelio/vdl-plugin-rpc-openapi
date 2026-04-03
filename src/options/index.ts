import { fail } from "@varavel/vdl-plugin-sdk";
import { getOptionString } from "@varavel/vdl-plugin-sdk/utils/options";
import { extname } from "@varavel/vdl-plugin-sdk/utils/paths";

const DEFAULT_OUT_FILE = "openapi.yaml";
const DEFAULT_TITLE = "VDL RPC API";
const DEFAULT_VERSION = "1.0.0";

type OutFormat = "yaml" | "json";

export type PluginOptions = {
  outFile: string;
  outFormat: OutFormat;
  title: string;
  version: string;
  description?: string;
  baseUrl?: string;
  contactName?: string;
  contactEmail?: string;
  licenseName?: string;
};

/**
 * Resolves plugin options with defaults and validates output format constraints.
 */
export function resolvePluginOptions(
  options: Record<string, string>,
): PluginOptions {
  const outFile = getOptionString(options, "outFile", DEFAULT_OUT_FILE);
  const outFormat = resolveOutFormat(outFile);
  const title = requiredStrOption(options, "title", DEFAULT_TITLE);
  const version = requiredStrOption(options, "version", DEFAULT_VERSION);

  return {
    outFile,
    outFormat,
    title,
    version,
    description: optionalStrOption(options, "description"),
    baseUrl: optionalStrOption(options, "baseUrl"),
    contactName: optionalStrOption(options, "contactName"),
    contactEmail: optionalStrOption(options, "contactEmail"),
    licenseName: optionalStrOption(options, "licenseName"),
  };
}

function resolveOutFormat(outFile: string): OutFormat {
  const extension = extname(outFile).toLowerCase();

  if (extension === ".json") return "json";
  if (extension === ".yaml") return "yaml";
  if (extension === ".yml") return "yaml";

  fail(
    `Option "outFile" must end with .yaml, .yml, or .json. Received: ${JSON.stringify(outFile)}.`,
  );
}

function requiredStrOption(
  options: Record<string, string>,
  key: string,
  defaultValue: string,
): string {
  const value = getOptionString(options, key, defaultValue);
  return value === "" ? defaultValue : value;
}

function optionalStrOption(
  options: Record<string, string>,
  key: string,
): string | undefined {
  const value = getOptionString(options, key, "");
  return value === "" ? undefined : value;
}
