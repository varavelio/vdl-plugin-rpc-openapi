import type { IrSchema } from "@varavel/vdl-plugin-sdk";
import { getAnnotation } from "@varavel/vdl-plugin-sdk/utils/ir";
import { pascalCase } from "@varavel/vdl-plugin-sdk/utils/strings";
import type { RpcGroup } from "../rpc-model";
import {
  generateEnumSchema,
  generateProcedureResponse,
  generateRequestBody,
  generateStreamResponse,
  generateTypeSchema,
} from "./schema-fragments";

const AUTH_TOKEN_DESCRIPTION =
  "Enter the full value for the Authorization header. The specific format (Bearer, Basic, API Key, etc.) is determined by the server's implementation.\n\n---\n**Examples:**\n- **Bearer Token:** `Bearer eyJhbGciOiJIUzI1Ni...` (a JWT token)\n- **Basic Auth:** `Basic dXNlcm5hbWU6cGFzc3dvcmQ=` (a base64 encoding of `username:password`)\n- **API Key:** `sk_live_123abc456def` (a raw token)";

/**
 * Builds the reusable OpenAPI components section.
 */
export function buildComponents(
  ir: IrSchema,
  rpcGroups: RpcGroup[],
): Record<string, unknown> {
  const schemas = buildSchemas(ir);
  const requestBodies = buildRequestBodies(rpcGroups);
  const responses = buildResponses(rpcGroups);

  const components: Record<string, unknown> = {
    securitySchemes: {
      AuthToken: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: AUTH_TOKEN_DESCRIPTION,
      },
    },
  };

  if (Object.keys(schemas).length > 0) {
    components.schemas = schemas;
  }

  if (Object.keys(requestBodies).length > 0) {
    components.requestBodies = requestBodies;
  }

  if (Object.keys(responses).length > 0) {
    components.responses = responses;
  }

  return components;
}

function buildSchemas(ir: IrSchema): Record<string, unknown> {
  const typeEntries: Array<[string, unknown]> = [];
  const enumEntries: Array<[string, unknown]> = [];

  for (const typeDef of ir.types) {
    if (getAnnotation(typeDef.annotations, "rpc")) {
      continue;
    }

    typeEntries.push([typeDef.name, generateTypeSchema(typeDef)]);
  }

  for (const enumDef of ir.enums) {
    enumEntries.push([enumDef.name, generateEnumSchema(enumDef)]);
  }

  typeEntries.sort((left, right) => left[0].localeCompare(right[0]));
  enumEntries.sort((left, right) => left[0].localeCompare(right[0]));

  return entriesToRecord([...typeEntries, ...enumEntries]);
}

function buildRequestBodies(rpcGroups: RpcGroup[]): Record<string, unknown> {
  const entries: Array<[string, unknown]> = [];

  for (const group of rpcGroups) {
    for (const operation of group.procedures) {
      const inputName = `${group.name}${pascalCase(operation.name)}Input`;

      entries.push([
        inputName,
        generateRequestBody(
          operation.inputFields,
          `Request body for ${group.name}/${operation.name} procedure`,
        ),
      ]);
    }

    for (const operation of group.streams) {
      const inputName = `${group.name}${pascalCase(operation.name)}Input`;

      entries.push([
        inputName,
        generateRequestBody(
          operation.inputFields,
          `Request body for ${group.name}/${operation.name} stream subscription`,
        ),
      ]);
    }
  }

  entries.sort((left, right) => left[0].localeCompare(right[0]));

  return entriesToRecord(entries);
}

function buildResponses(rpcGroups: RpcGroup[]): Record<string, unknown> {
  const entries: Array<[string, unknown]> = [];

  for (const group of rpcGroups) {
    for (const operation of group.procedures) {
      const outputName = `${group.name}${pascalCase(operation.name)}Output`;

      entries.push([
        outputName,
        generateProcedureResponse(
          operation.outputFields,
          `Response for ${group.name}/${operation.name} procedure`,
        ),
      ]);
    }

    for (const operation of group.streams) {
      const outputName = `${group.name}${pascalCase(operation.name)}Output`;

      entries.push([
        outputName,
        generateStreamResponse(
          operation.outputFields,
          `Server-Sent Events for ${group.name}/${operation.name} stream`,
        ),
      ]);
    }
  }

  entries.sort((left, right) => left[0].localeCompare(right[0]));

  return entriesToRecord(entries);
}

function entriesToRecord(
  entries: Array<[string, unknown]>,
): Record<string, unknown> {
  const record: Record<string, unknown> = {};

  for (const [key, value] of entries) {
    record[key] = value;
  }

  return record;
}
