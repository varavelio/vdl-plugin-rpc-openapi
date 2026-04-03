import type { EnumDef, Field, TypeDef, TypeRef } from "@varavel/vdl-plugin-sdk";
import { unwrapLiteral } from "@varavel/vdl-plugin-sdk/utils/ir";
import { getDeprecatedMessage, hasDeprecatedAnnotation } from "./deprecation";

/**
 * Converts a type definition to a reusable OpenAPI schema under components.
 */
export function generateTypeSchema(typeDef: TypeDef): Record<string, unknown> {
  let schema: Record<string, unknown>;

  if (typeDef.typeRef.kind === "object") {
    const { properties, required } = generatePropertiesFromFields(
      typeDef.typeRef.objectFields ?? [],
    );

    schema = {
      type: "object",
      properties,
    };

    if (required.length > 0) {
      schema.required = required;
    }
  } else {
    schema = generateTypeRefSchema(typeDef.typeRef);
  }

  if (typeDef.doc) {
    schema.description = typeDef.doc;
  }

  const deprecatedMessage = getDeprecatedMessage(typeDef.annotations);

  if (deprecatedMessage !== undefined) {
    schema.deprecated = true;

    if (deprecatedMessage !== "") {
      const currentDescription = String(schema.description ?? "");
      schema.description =
        currentDescription === ""
          ? `Deprecated: ${deprecatedMessage}`
          : `${currentDescription}\n\nDeprecated: ${deprecatedMessage}`;
    }
  }

  return schema;
}

/**
 * Converts an enum definition to a primitive OpenAPI enum schema.
 */
export function generateEnumSchema(enumDef: EnumDef): Record<string, unknown> {
  const schema: Record<string, unknown> = {};

  if (enumDef.enumType === "string") {
    schema.type = "string";
    schema.enum = enumDef.members.map((member) => {
      return String(unwrapLiteral(member.value));
    });
  } else {
    schema.type = "integer";
    schema.enum = enumDef.members.map((member) => {
      return Number(unwrapLiteral(member.value));
    });
  }

  if (enumDef.doc) {
    schema.description = enumDef.doc;
  }

  if (hasDeprecatedAnnotation(enumDef.annotations)) {
    schema.deprecated = true;
  }

  return schema;
}

/**
 * Converts an IR type reference into an OpenAPI schema fragment.
 */
export function generateTypeRefSchema(
  typeRef: TypeRef,
): Record<string, unknown> {
  switch (typeRef.kind) {
    case "primitive":
      return primitiveToJsonSchema(typeRef.primitiveName);
    case "type":
      return { $ref: `#/components/schemas/${typeRef.typeName}` };
    case "enum":
      return { $ref: `#/components/schemas/${typeRef.enumName}` };
    case "array": {
      const dimensions = typeRef.arrayDims ?? 1;
      let itemSchema = generateTypeRefSchema(
        typeRef.arrayType ?? { kind: "object" },
      );

      for (let depth = 1; depth < dimensions; depth += 1) {
        itemSchema = {
          type: "array",
          items: itemSchema,
        };
      }

      return {
        type: "array",
        items: itemSchema,
      };
    }
    case "map":
      return {
        type: "object",
        additionalProperties: generateTypeRefSchema(
          typeRef.mapType ?? { kind: "object" },
        ),
      };
    case "object": {
      const { properties, required } = generatePropertiesFromFields(
        typeRef.objectFields ?? [],
      );
      const schema: Record<string, unknown> = {
        type: "object",
        properties,
      };

      if (required.length > 0) {
        schema.required = required;
      }

      return schema;
    }
    default:
      return {};
  }
}

/**
 * Builds property schemas and tracks the required field list in source order.
 */
export function generatePropertiesFromFields(fields: Field[]): {
  properties: Record<string, unknown>;
  required: string[];
} {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const field of fields) {
    let propertySchema = generateTypeRefSchema(field.typeRef);

    if (field.doc) {
      if (propertySchema.$ref) {
        propertySchema = {
          allOf: [propertySchema, { description: field.doc }],
        };
      } else {
        propertySchema.description = field.doc;
      }
    }

    properties[field.name] = propertySchema;

    if (!field.optional) {
      required.push(field.name);
    }
  }

  return { properties, required };
}

export function generateRequestBody(
  fields: Field[],
  description: string,
): Record<string, unknown> {
  const { properties, required } = generatePropertiesFromFields(fields);
  const schema: Record<string, unknown> = {
    type: "object",
    properties,
  };

  if (required.length > 0) {
    schema.required = required;
  }

  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

export function generateProcedureResponse(
  fields: Field[],
  description: string,
): Record<string, unknown> {
  return {
    description,
    content: {
      "application/json": {
        schema: buildOutputEnvelopeSchema(fields),
      },
    },
  };
}

export function generateStreamResponse(
  fields: Field[],
  description: string,
): Record<string, unknown> {
  return {
    description,
    content: {
      "text/event-stream": {
        schema: buildOutputEnvelopeSchema(fields),
      },
    },
  };
}

function buildOutputEnvelopeSchema(fields: Field[]): Record<string, unknown> {
  const { properties, required } = generateOutputProperties(fields);
  const schema: Record<string, unknown> = {
    type: "object",
    properties,
  };

  if (required.length > 0) {
    schema.required = required;
  }

  return schema;
}

function generateOutputProperties(fields: Field[]): {
  properties: Record<string, unknown>;
  required: string[];
} {
  const { properties: outputProperties, required: outputRequired } =
    generatePropertiesFromFields(fields);

  const output: Record<string, unknown> = {
    type: "object",
    properties: outputProperties,
  };

  if (outputRequired.length > 0) {
    output.required = outputRequired;
  }

  return {
    properties: {
      ok: { type: "boolean" },
      output,
      error: {
        type: "object",
        properties: {
          message: { type: "string" },
          category: { type: "string" },
          code: { type: "string" },
          details: {
            type: "object",
            properties: {},
            additionalProperties: true,
          },
        },
        required: ["message"],
      },
    },
    required: ["ok"],
  };
}

function primitiveToJsonSchema(
  primitiveName: TypeRef["primitiveName"],
): Record<string, unknown> {
  switch (primitiveName) {
    case "string":
      return { type: "string" };
    case "int":
      return { type: "integer" };
    case "float":
      return { type: "number" };
    case "bool":
      return { type: "boolean" };
    case "datetime":
      return { type: "string", format: "date-time" };
    default:
      return { type: "string" };
  }
}
