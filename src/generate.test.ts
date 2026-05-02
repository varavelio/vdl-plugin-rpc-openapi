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

  it("generates an HTML playground file when playgroundFile is provided", () => {
    const output = generateOpenApi(
      pluginInput({
        options: {
          outFile: "openapi.yaml",
          title: "Payments API",
          playgroundFile: "playground.html",
        },
      }),
    );

    expect(output.files).toHaveLength(2);

    const openApiFile = getGeneratedFile(output, "openapi.yaml");
    const playgroundFile = getGeneratedFile(output, "playground.html");

    expect(
      parseYaml<Record<string, unknown>>(openApiFile.content).openapi,
    ).toBe("3.0.0");
    expect(playgroundFile.content).toContain("<title>Payments API</title>");
    expect(playgroundFile.content).toContain("const OPENAPI_SPEC = {");
    expect(playgroundFile.content).toContain('"openapi": "3.0.0"');
    expect(playgroundFile.content).not.toContain("<title>API Docs</title>");
    expect(playgroundFile.content).not.toContain("const OPENAPI_SPEC = {};");
  });

  it("generates a Scalar playground when playgroundUi is scalar", () => {
    const output = generateOpenApi(
      pluginInput({
        options: {
          title: "Scalar API",
          playgroundFile: "playground.html",
          playgroundUi: "scalar",
        },
      }),
    );

    const playgroundFile = getGeneratedFile(output, "playground.html");

    expect(playgroundFile.content).toContain("<title>Scalar API</title>");
    expect(playgroundFile.content).toContain(
      "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.55.1/dist/browser/standalone.js",
    );
    expect(playgroundFile.content).toContain(
      "Scalar.createApiReference('#app', {",
    );
    expect(playgroundFile.content).toContain(
      'content: "{\\n  \\"openapi\\": \\"3.0.0\\"',
    );
    expect(playgroundFile.content).not.toContain("SwaggerUIBundle(");
  });

  it("generates a Stoplight Elements playground when playgroundUi is stoplight-elements", () => {
    const output = generateOpenApi(
      pluginInput({
        options: {
          title: "Elements API",
          playgroundFile: "playground.html",
          playgroundUi: "stoplight-elements",
        },
      }),
    );

    const playgroundFile = getGeneratedFile(output, "playground.html");

    expect(playgroundFile.content).toContain("<title>Elements API</title>");
    expect(playgroundFile.content).toContain(
      "https://cdn.jsdelivr.net/npm/@stoplight/elements@9.0.19/web-components.min.js",
    );
    expect(playgroundFile.content).toContain(
      "https://cdn.jsdelivr.net/npm/@stoplight/elements@9.0.19/styles.min.css",
    );
    expect(playgroundFile.content).toContain("crossorigin");
    expect(playgroundFile.content).toContain('<elements-api id="docs"');
    expect(playgroundFile.content).toContain(
      "docs.apiDescriptionDocument = OPENAPI_SPEC;",
    );
    expect(playgroundFile.content).toContain('"openapi": "3.0.0"');
    expect(playgroundFile.content).not.toContain("SwaggerUIBundle(");
    expect(playgroundFile.content).not.toContain("Scalar.createApiReference(");
  });

  it("escapes closing script tags in the embedded playground JSON", () => {
    const output = generateOpenApi(
      pluginInput({
        options: {
          description: "Danger </script><script>alert(1)</script>",
          playgroundFile: "playground.html",
        },
      }),
    );

    const playgroundFile = getGeneratedFile(output, "playground.html");

    expect(playgroundFile.content).toContain(
      '"description": "Danger \\u003c/script\\u003e\\u003cscript\\u003ealert(1)\\u003c/script\\u003e"',
    );
    expect(playgroundFile.content).not.toContain(
      '"description": "Danger </script><script>alert(1)</script>"',
    );
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

  it("writes multiple servers when baseUrl contains comma-separated URLs", () => {
    const output = generateOpenApi(
      pluginInput({
        options: {
          baseUrl: "https://api.example.com, https://backup.example.com",
        },
      }),
    );

    const parsed = parseYaml<Record<string, unknown>>(
      getSingleGeneratedFile(output).content,
    );

    expect(parsed.servers).toEqual([
      { url: "https://api.example.com" },
      { url: "https://backup.example.com" },
    ]);
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

function getGeneratedFile(
  output: PluginOutput,
  path: string,
): PluginOutputFile {
  const generatedFile = output.files?.find((file) => file.path === path);

  expect(generatedFile).toBeDefined();

  return generatedFile as PluginOutputFile;
}
