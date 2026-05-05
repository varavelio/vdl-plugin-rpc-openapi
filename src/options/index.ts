import { fail } from "@varavel/vdl-plugin-sdk";
import {
  getOptionArray,
  getOptionString,
} from "@varavel/vdl-plugin-sdk/utils/options";
import { extname } from "@varavel/vdl-plugin-sdk/utils/paths";
import { trim } from "@varavel/vdl-plugin-sdk/utils/strings";

const DEFAULT_OUT_FILE = "openapi.yaml";
const DEFAULT_PLAYGROUND_UI = "swagger-ui";
const DEFAULT_TITLE = "VDL RPC API";
const DEFAULT_VERSION = "1.0.0";

type OutFormat = "yaml" | "json";
type PlaygroundUi = "swagger-ui" | "scalar" | "stoplight-elements";

export type PluginOptions = {
  /** Path for the generated OpenAPI schema file. When undefined, no schema file is produced. */
  outFile: string | undefined;
  outFormat: OutFormat;
  playgroundFile?: string;
  playgroundUi: PlaygroundUi;
  title: string;
  version: string;
  description?: string;
  baseUrls?: string[];
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
  const rawOutFile = getOptionString(options, "outFile", DEFAULT_OUT_FILE);
  const outFile = rawOutFile === "" ? undefined : rawOutFile;
  const outFormat = outFile ? resolveOutFormat(outFile) : "yaml";
  const playgroundFile = resolvePlaygroundFile(options);
  const playgroundUi = resolvePlaygroundUi(options);
  const title = requiredStrOption(options, "title", DEFAULT_TITLE);
  const version = requiredStrOption(options, "version", DEFAULT_VERSION);

  return {
    outFile,
    outFormat,
    playgroundFile,
    playgroundUi,
    title,
    version,
    description: optionalStrOption(options, "description"),
    baseUrls: resolveBaseUrls(options),
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

function resolvePlaygroundFile(
  options: Record<string, string>,
): string | undefined {
  const playgroundFile = trim(
    optionalStrOption(options, "playgroundFile") ?? "",
  );

  if (!playgroundFile) {
    return undefined;
  }

  if (extname(playgroundFile).toLowerCase() === ".html") {
    return playgroundFile;
  }

  fail(
    `Option "playgroundFile" must end with .html. Received: ${JSON.stringify(playgroundFile)}.`,
  );
}

function resolvePlaygroundUi(options: Record<string, string>): PlaygroundUi {
  const playgroundUi = trim(
    getOptionString(options, "playgroundUi", DEFAULT_PLAYGROUND_UI),
  ).toLowerCase();

  if (
    playgroundUi === "swagger-ui" ||
    playgroundUi === "scalar" ||
    playgroundUi === "stoplight-elements"
  ) {
    return playgroundUi;
  }

  fail(
    `Option "playgroundUi" must be one of "swagger-ui", "scalar", or "stoplight-elements". Received: ${JSON.stringify(playgroundUi)}.`,
  );
}

function resolveBaseUrls(
  options: Record<string, string>,
): string[] | undefined {
  const baseUrls = getOptionArray(options, "baseUrl", [], ",");

  return baseUrls.length > 0 ? baseUrls : undefined;
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
