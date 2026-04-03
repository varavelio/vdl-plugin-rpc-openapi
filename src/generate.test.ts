import type { PluginOutput, PluginOutputFile } from "@varavel/vdl-plugin-sdk";
import {
  annotation,
  field,
  objectType,
  pluginInput,
  primitiveType,
  schema,
  typeDef,
} from "@varavel/vdl-plugin-sdk/testing";
import { parse as parseYaml } from "@varavel/vdl-plugin-sdk/utils/yaml";
import { describe, expect, it } from "vitest";
import { generateOpenApi } from "./generate";

describe("generateOpenApi", () => {
  it("returns YAML output by default", () => {
    const output = generateOpenApi(
      pluginInput({
        ir: schema(),
      }),
    );

    const generatedFile = getSingleGeneratedFile(output);

    expect(generatedFile.path).toBe("openapi.yaml");

    const parsed = parseYaml<Record<string, unknown>>(generatedFile.content);
    expect(parsed.openapi).toBe("3.0.0");
  });

  it("returns JSON output when outFile extension is .json", () => {
    const output = generateOpenApi(
      pluginInput({
        options: {
          outFile: "api.json",
        },
      }),
    );

    const generatedFile = getSingleGeneratedFile(output);

    expect(generatedFile.path).toBe("api.json");
    expect(JSON.parse(generatedFile.content).openapi).toBe("3.0.0");
  });

  it("writes info metadata from options", () => {
    const output = generateOpenApi(
      pluginInput({
        options: {
          title: "Payments API",
          version: "2.0.0",
          description: "Internal payments endpoints",
          contactName: "Platform Team",
          contactEmail: "platform@example.com",
          licenseName: "Apache-2.0",
          baseUrl: "https://payments.example.com",
        },
      }),
    );

    const parsed = parseYaml<Record<string, unknown>>(
      getSingleGeneratedFile(output).content,
    );
    const info = parsed.info as Record<string, unknown>;

    expect(info.title).toBe("Payments API");
    expect(info.version).toBe("2.0.0");
    expect(info.description).toBe("Internal payments endpoints");
    expect(parsed.servers).toEqual([{ url: "https://payments.example.com" }]);
  });

  it("generates paths and components from RPC operations", () => {
    const output = generateOpenApi(
      pluginInput({
        ir: schema({
          types: [
            typeDef(
              "Service",
              objectType([
                field(
                  "Ping",
                  objectType([
                    field(
                      "input",
                      objectType([field("id", primitiveType("string"))]),
                    ),
                    field(
                      "output",
                      objectType([field("ok", primitiveType("bool"))]),
                    ),
                  ]),
                  { annotations: [annotation("proc")] },
                ),
              ]),
              { annotations: [annotation("rpc")] },
            ),
          ],
        }),
      }),
    );

    const parsed = parseYaml<Record<string, unknown>>(
      getSingleGeneratedFile(output).content,
    );
    const paths = parsed.paths as Record<string, unknown>;

    expect(paths["/Service/Ping"]).toBeDefined();

    const components = parsed.components as Record<string, unknown>;
    const requestBodies = components.requestBodies as Record<string, unknown>;
    const responses = components.responses as Record<string, unknown>;

    expect(requestBodies.ServicePingInput).toBeDefined();
    expect(responses.ServicePingOutput).toBeDefined();
  });
});

function getSingleGeneratedFile(output: PluginOutput): PluginOutputFile {
  expect(output.files).toHaveLength(1);

  const generatedFile = output.files?.[0];
  expect(generatedFile).toBeDefined();

  return generatedFile as PluginOutputFile;
}
