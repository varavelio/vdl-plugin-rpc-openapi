import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse as parseYaml } from "@varavel/vdl-plugin-sdk/utils/yaml";
import { beforeAll, describe, expect, it } from "vitest";

// These tests exercise the built plugin through the real VDL CLI so every
// fixture covers the same integration path used by plugin consumers.
const repoRoot = resolve(__dirname, "..");
const fixturesDir = resolve(repoRoot, "e2e/fixtures");
const localVdlBin = resolve(repoRoot, "node_modules/.bin/vdl");

// Each fixture folder is a complete VDL project with a schema, plugin config,
// and one golden file describing the expected OpenAPI document.
const fixtureNames = readdirSync(fixturesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right));

describe("VDL Plugin OpenAPI e2e fixtures", () => {
  beforeAll(() => {
    // Build once up front so every fixture uses the latest local plugin bundle.
    execFileSync("npm", ["run", "build"], {
      cwd: repoRoot,
      stdio: "pipe",
    });
  });

  it("includes all permanent e2e fixtures", () => {
    expect(fixtureNames).toHaveLength(18);
  });

  it.each(fixtureNames)("matches fixture %s", (fixtureName) => {
    const fixtureDir = join(fixturesDir, fixtureName);
    const expectedFileName = findExpectedFileName(fixtureDir);

    // Fixtures stay intentionally minimal so the golden file is the only source
    // of truth beyond the schema and the plugin configuration.
    expect(listTrackedFixtureFiles(fixtureDir)).toEqual([
      expectedFileName,
      "schema.vdl",
      "vdl.config.vdl",
    ]);

    try {
      // Start from a clean project directory so assertions only observe files
      // produced by the current test execution.
      rmSync(join(fixtureDir, "gen"), { recursive: true, force: true });
      rmSync(join(fixtureDir, "vdl.lock"), { recursive: true, force: true });

      // Run the real local VDL binary instead of calling generator helpers
      // directly. This keeps the suite focused on end-to-end parity.
      execFileSync(localVdlBin, ["generate"], {
        cwd: fixtureDir,
        stdio: "pipe",
      });

      const generatedPath = findGeneratedFile(fixtureDir);
      const expectedPath = join(fixtureDir, expectedFileName);

      // Compare parsed documents so formatting differences do not hide real
      // regressions in the generated OpenAPI structure.
      expect(parseByExtension(generatedPath)).toEqual(
        parseByExtension(expectedPath),
      );
    } finally {
      // Generated output is disposable and must never become fixture input.
      rmSync(join(fixtureDir, "gen"), { recursive: true, force: true });
      rmSync(join(fixtureDir, "vdl.lock"), { recursive: true, force: true });
    }
  });
});

function listTrackedFixtureFiles(fixtureDir: string): string[] {
  // `gen/` and `vdl.lock` are runtime artifacts, so the fixture contract only
  // counts the source files that should stay committed.
  return readdirSync(fixtureDir, { withFileTypes: true })
    .filter((entry) => entry.name !== "gen" && entry.name !== "vdl.lock")
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function findExpectedFileName(
  fixtureDir: string,
): "expected.json" | "expected.yaml" | "expected.yml" {
  const trackedFiles = listTrackedFixtureFiles(fixtureDir);

  if (trackedFiles.includes("expected.json")) {
    return "expected.json";
  }

  if (trackedFiles.includes("expected.yml")) {
    return "expected.yml";
  }

  if (trackedFiles.includes("expected.yaml")) {
    return "expected.yaml";
  }

  throw new Error(`Expected file not found in fixture: ${fixtureDir}`);
}

function findGeneratedFile(fixtureDir: string): string {
  const generatedDir = join(fixtureDir, "gen");
  const generatedFiles = readdirSync(generatedDir)
    .filter(
      (name) =>
        name.endsWith(".yaml") ||
        name.endsWith(".yml") ||
        name.endsWith(".json"),
    )
    .sort((left, right) => left.localeCompare(right));

  const firstGeneratedFile = generatedFiles[0];

  if (!firstGeneratedFile) {
    throw new Error(`No generated OpenAPI file found in ${generatedDir}`);
  }

  return join(generatedDir, firstGeneratedFile);
}

function parseByExtension(path: string): unknown {
  const content = readFileSync(path, "utf-8");

  if (path.endsWith(".json")) {
    return JSON.parse(content);
  }

  // YAML comparison is structural for both `.yaml` and `.yml` outputs.
  return parseYaml(content);
}
