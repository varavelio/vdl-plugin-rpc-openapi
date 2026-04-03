import { describe, expect, it } from "vitest";
import { resolvePluginOptions } from "./index";

describe("resolveOpenApiOptions", () => {
  it("uses defaults when no options are provided", () => {
    const options = resolvePluginOptions({});

    expect(options).toMatchObject({
      outFile: "openapi.yaml",
      outFormat: "yaml",
      title: "VDL RPC API",
      version: "1.0.0",
    });
  });

  it("accepts JSON output when outFile ends with .json", () => {
    const options = resolvePluginOptions({ outFile: "api.json" });

    expect(options.outFile).toBe("api.json");
    expect(options.outFormat).toBe("json");
  });

  it("accepts YAML output when outFile ends with .yaml", () => {
    const options = resolvePluginOptions({ outFile: "api.yaml" });

    expect(options.outFile).toBe("api.yaml");
    expect(options.outFormat).toBe("yaml");
  });

  it("accepts YAML output when outFile ends with .yml", () => {
    const options = resolvePluginOptions({ outFile: "api.yml" });

    expect(options.outFile).toBe("api.yml");
    expect(options.outFormat).toBe("yaml");
  });

  it("maps optional metadata fields", () => {
    const options = resolvePluginOptions({
      title: "Billing API",
      version: "2.5.1",
      description: "Payments and invoices",
      baseUrl: "https://api.example.com",
      contactName: "API Team",
      contactEmail: "api@example.com",
      licenseName: "MIT",
    });

    expect(options).toMatchObject({
      title: "Billing API",
      version: "2.5.1",
      description: "Payments and invoices",
      baseUrl: "https://api.example.com",
      contactName: "API Team",
      contactEmail: "api@example.com",
      licenseName: "MIT",
    });
  });

  it("replaces empty title and version with defaults", () => {
    const options = resolvePluginOptions({ title: "", version: "" });

    expect(options.title).toBe("VDL RPC API");
    expect(options.version).toBe("1.0.0");
  });

  it("throws when outFile has an unsupported extension", () => {
    expect(() => {
      resolvePluginOptions({ outFile: "openapi.txt" });
    }).toThrowError('Option "outFile" must end with .yaml, .yml, or .json');
  });
});
