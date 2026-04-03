import {
  annotation,
  field,
  objectType,
  primitiveType,
  schema,
  typeDef,
} from "@varavel/vdl-plugin-sdk/testing";
import { describe, expect, it } from "vitest";
import { extractRpcGroups } from "./index";

describe("extractRpcGroups", () => {
  it("extracts procedure and stream operations from @rpc types", () => {
    const ir = schema({
      types: [
        typeDef(
          "ChatService",
          objectType([
            field(
              "SendMessage",
              objectType([
                field(
                  "input",
                  objectType([field("text", primitiveType("string"))]),
                ),
                field(
                  "output",
                  objectType([field("id", primitiveType("string"))]),
                ),
              ]),
              { annotations: [annotation("proc")] },
            ),
            field(
              "OnMessage",
              objectType([
                field(
                  "input",
                  objectType([field("chatId", primitiveType("string"))]),
                ),
                field(
                  "output",
                  objectType([field("payload", primitiveType("string"))]),
                ),
              ]),
              { annotations: [annotation("stream")] },
            ),
          ]),
          {
            doc: "Chat APIs",
            annotations: [annotation("rpc")],
          },
        ),
      ],
    });

    const groups = extractRpcGroups(ir);
    const firstGroup = groups[0];

    expect(groups).toHaveLength(1);
    expect(firstGroup).toBeDefined();

    expect(firstGroup?.name).toBe("ChatService");
    expect(firstGroup?.doc).toBe("Chat APIs");
    expect(firstGroup?.procedures.map((item) => item.name)).toEqual([
      "SendMessage",
    ]);
    expect(firstGroup?.streams.map((item) => item.name)).toEqual(["OnMessage"]);
  });

  it("ignores non-rpc types", () => {
    const ir = schema({
      types: [
        typeDef("User", objectType([field("id", primitiveType("string"))])),
      ],
    });

    expect(extractRpcGroups(ir)).toEqual([]);
  });

  it("ignores fields without @proc or @stream", () => {
    const ir = schema({
      types: [
        typeDef(
          "Service",
          objectType([
            field("helper", primitiveType("string")),
            field(
              "Ping",
              objectType([
                field("input", objectType([])),
                field("output", objectType([])),
              ]),
              { annotations: [annotation("proc")] },
            ),
          ]),
          { annotations: [annotation("rpc")] },
        ),
      ],
    });

    const groups = extractRpcGroups(ir);
    const firstGroup = groups[0];

    expect(groups).toHaveLength(1);
    expect(firstGroup).toBeDefined();
    expect(firstGroup?.procedures).toHaveLength(1);
    expect(firstGroup?.procedures[0]?.name).toBe("Ping");
  });

  it("treats missing input and output blocks as empty payloads", () => {
    const ir = schema({
      types: [
        typeDef(
          "Service",
          objectType([
            field("Ping", objectType([]), {
              annotations: [annotation("proc")],
            }),
          ]),
          { annotations: [annotation("rpc")] },
        ),
      ],
    });

    const group = extractRpcGroups(ir)[0];
    expect(group).toBeDefined();
    expect(group?.procedures[0]?.inputFields).toEqual([]);
    expect(group?.procedures[0]?.outputFields).toEqual([]);
  });

  it("marks operation as deprecated when annotation is present", () => {
    const ir = schema({
      types: [
        typeDef(
          "Service",
          objectType([
            field("Delete", objectType([]), {
              annotations: [annotation("proc"), annotation("deprecated")],
            }),
          ]),
          { annotations: [annotation("rpc")] },
        ),
      ],
    });

    const group = extractRpcGroups(ir)[0];
    expect(group).toBeDefined();
    expect(group?.procedures[0]?.deprecated).toBe(true);
  });
});
