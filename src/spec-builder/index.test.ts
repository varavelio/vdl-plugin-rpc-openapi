import {
  annotation,
  enumDef,
  enumMember,
  field,
  intLiteral,
  objectType,
  primitiveType,
  schema,
  stringLiteral,
  typeDef,
} from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import type { PluginOptions } from "../options";
import type { RpcGroup } from "../rpc-model";
import {
  buildOpenApiSpec,
  generateEnumSchema,
  generatePropertiesFromFields,
  generateTypeRefSchema,
  generateTypeSchema,
} from "./index";

const baseOptions: PluginOptions = {
  outFile: "openapi.yaml",
  outFormat: "yaml",
  title: "Test API",
  version: "1.0.0",
};

describe("generateTypeRefSchema", () => {
  it("maps primitive and date-time types", () => {
    expect(generateTypeRefSchema(primitiveType("string"))).toEqual({
      type: "string",
    });
    expect(generateTypeRefSchema(primitiveType("datetime"))).toEqual({
      type: "string",
      format: "date-time",
    });
  });

  it("maps references for custom types and enums", () => {
    expect(
      generateTypeRefSchema({
        kind: "type",
        typeName: "User",
      }),
    ).toEqual({
      $ref: "#/components/schemas/User",
    });

    expect(
      generateTypeRefSchema({
        kind: "enum",
        enumName: "Role",
      }),
    ).toEqual({
      $ref: "#/components/schemas/Role",
    });
  });

  it("supports multi-dimensional arrays", () => {
    const schemaValue = generateTypeRefSchema({
      kind: "array",
      arrayDims: 3,
      arrayType: primitiveType("int"),
    });

    expect(schemaValue).toEqual({
      type: "array",
      items: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "integer",
          },
        },
      },
    });
  });

  it("maps map types to additionalProperties", () => {
    expect(
      generateTypeRefSchema({
        kind: "map",
        mapType: primitiveType("bool"),
      }),
    ).toEqual({
      type: "object",
      additionalProperties: {
        type: "boolean",
      },
    });
  });
});

describe("generatePropertiesFromFields", () => {
  it("tracks required fields and keeps optional fields out of required", () => {
    const { properties, required } = generatePropertiesFromFields([
      field("id", primitiveType("string")),
      field("nickname", primitiveType("string"), { optional: true }),
    ]);

    expect(Object.keys(properties)).toEqual(["id", "nickname"]);
    expect(required).toEqual(["id"]);
  });

  it("wraps references in allOf when a field has a description", () => {
    const { properties } = generatePropertiesFromFields([
      field(
        "user",
        {
          kind: "type",
          typeName: "User",
        },
        { doc: "The user payload" },
      ),
    ]);

    expect(properties.user).toEqual({
      allOf: [
        {
          $ref: "#/components/schemas/User",
        },
        {
          description: "The user payload",
        },
      ],
    });
  });
});

describe("generateTypeSchema and generateEnumSchema", () => {
  it("marks deprecated types and appends deprecation message", () => {
    const typeSchema = generateTypeSchema(
      typeDef("Legacy", objectType([field("id", primitiveType("string"))]), {
        annotations: [annotation("deprecated", stringLiteral("Use NewType"))],
      }),
    );

    expect(typeSchema.deprecated).toBe(true);
    expect(typeSchema.description).toBe("Deprecated: Use NewType");
  });

  it("keeps deprecated text on a new paragraph when a description already exists", () => {
    const typeSchema = generateTypeSchema(
      typeDef("Legacy", objectType([field("id", primitiveType("string"))]), {
        doc: "Legacy payload.",
        annotations: [annotation("deprecated", stringLiteral("Use NewType"))],
      }),
    );

    expect(typeSchema.description).toBe(
      "Legacy payload.\n\nDeprecated: Use NewType",
    );
  });

  it("supports both string and integer enums", () => {
    const roleSchema = generateEnumSchema(
      enumDef("Role", "string", [
        enumMember("Admin", stringLiteral("Admin")),
        enumMember("User", stringLiteral("User")),
      ]),
    );

    const prioritySchema = generateEnumSchema(
      enumDef("Priority", "int", [
        enumMember("Low", intLiteral(1)),
        enumMember("High", intLiteral(10)),
      ]),
    );

    expect(roleSchema).toMatchObject({
      type: "string",
      enum: ["Admin", "User"],
    });
    expect(prioritySchema).toMatchObject({
      type: "integer",
      enum: [1, 10],
    });
  });
});

describe("buildOpenApiSpec", () => {
  it("builds sorted tags and includes server metadata", () => {
    const ir = schema();
    const rpcGroups: RpcGroup[] = [
      {
        name: "Users",
        procedures: [
          {
            rpcName: "Users",
            rpcDoc: "User APIs",
            kind: "procedure",
            name: "get",
            deprecated: false,
            inputFields: [],
            outputFields: [],
          },
        ],
        streams: [],
      },
      {
        name: "Chat",
        procedures: [],
        streams: [
          {
            rpcName: "Chat",
            kind: "stream",
            name: "messages",
            deprecated: false,
            inputFields: [],
            outputFields: [],
          },
        ],
      },
    ];

    const spec = buildOpenApiSpec(ir, rpcGroups, {
      ...baseOptions,
      baseUrl: "https://api.example.com",
    });

    expect(spec.servers).toEqual([{ url: "https://api.example.com" }]);
    expect(spec.paths).toMatchObject({
      "/Chat/messages": {
        post: {
          requestBody: {
            $ref: "#/components/requestBodies/ChatMessagesInput",
          },
        },
      },
      "/Users/get": {
        post: {
          requestBody: {
            $ref: "#/components/requestBodies/UsersGetInput",
          },
        },
      },
    });
    expect(spec.tags).toEqual([
      {
        name: "ChatStreams",
        description: "Streams for Chat",
      },
      {
        name: "UsersProcedures",
        description: "Procedures for Users",
      },
    ]);
  });

  it("omits tags and paths when no RPC operations are present", () => {
    const spec = buildOpenApiSpec(schema(), [], baseOptions);

    expect(spec.tags).toBeUndefined();
    expect(spec.paths).toEqual({});
    expect(spec.components).toBeDefined();
  });

  it("includes stream responses with text/event-stream media type", () => {
    const spec = buildOpenApiSpec(
      schema(),
      [
        {
          name: "Feed",
          procedures: [],
          streams: [
            {
              rpcName: "Feed",
              kind: "stream",
              name: "updates",
              deprecated: false,
              inputFields: [],
              outputFields: [],
            },
          ],
        },
      ],
      baseOptions,
    );

    const components = spec.components as Record<string, unknown>;
    const responses = components.responses as Record<string, unknown>;
    const updatesResponse = responses.FeedUpdatesOutput as Record<
      string,
      unknown
    >;
    const content = updatesResponse.content as Record<string, unknown>;

    expect(content["text/event-stream"]).toBeDefined();
  });

  it("adds type and enum schemas while skipping @rpc types", () => {
    const ir = schema({
      types: [
        typeDef(
          "RpcService",
          objectType([
            field("Ping", objectType([]), {
              annotations: [annotation("proc")],
            }),
          ]),
          { annotations: [annotation("rpc")] },
        ),
        typeDef("User", objectType([field("id", primitiveType("string"))])),
      ],
      enums: [
        enumDef("Role", "string", [
          enumMember("Admin", stringLiteral("Admin")),
        ]),
      ],
    });

    const spec = buildOpenApiSpec(ir, [], baseOptions);
    const components = spec.components as Record<string, unknown>;
    const schemas = components.schemas as Record<string, unknown>;

    expect(schemas.User).toBeDefined();
    expect(schemas.Role).toBeDefined();
    expect(schemas.RpcService).toBeUndefined();
  });
});
