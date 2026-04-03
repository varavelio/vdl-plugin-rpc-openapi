import type { Field, IrSchema, TypeDef } from "@varavel/vdl-plugin-sdk";
import { getAnnotation } from "@varavel/vdl-plugin-sdk/utils/ir";

export type RpcOperationKind = "procedure" | "stream";

export type RpcOperation = {
  rpcName: string;
  rpcDoc?: string;
  kind: RpcOperationKind;
  name: string;
  doc?: string;
  deprecated: boolean;
  inputFields: Field[];
  outputFields: Field[];
};

export type RpcGroup = {
  name: string;
  doc?: string;
  procedures: RpcOperation[];
  streams: RpcOperation[];
};

/**
 * Builds a normalized RPC model from the IR so later stages only deal with
 * explicit RPC concepts instead of raw annotated fields.
 */
export function extractRpcGroups(ir: IrSchema): RpcGroup[] {
  const groups: RpcGroup[] = [];

  for (const typeDef of ir.types) {
    if (!hasAnnotation(typeDef, "rpc")) {
      continue;
    }

    const group = extractRpcGroup(typeDef);

    if (group.procedures.length > 0 || group.streams.length > 0) {
      groups.push(group);
    }
  }

  return groups;
}

function extractRpcGroup(typeDef: TypeDef): RpcGroup {
  const procedures: RpcOperation[] = [];
  const streams: RpcOperation[] = [];
  const rpcFields = typeDef.typeRef.objectFields ?? [];

  for (const field of rpcFields) {
    const operation = extractOperation(typeDef, field);

    if (!operation) {
      continue;
    }

    if (operation.kind === "procedure") {
      procedures.push(operation);
      continue;
    }

    streams.push(operation);
  }

  return {
    name: typeDef.name,
    doc: typeDef.doc,
    procedures,
    streams,
  };
}

function extractOperation(
  rpcType: TypeDef,
  field: Field,
): RpcOperation | undefined {
  const isProcedure = hasAnnotation(field, "proc");
  const isStream = hasAnnotation(field, "stream");

  if (!isProcedure && !isStream) {
    return undefined;
  }

  const operationFields = field.typeRef.objectFields ?? [];
  const inputField = operationFields.find((item) => item.name === "input");
  const outputField = operationFields.find((item) => item.name === "output");

  return {
    rpcName: rpcType.name,
    rpcDoc: rpcType.doc,
    kind: isProcedure ? "procedure" : "stream",
    name: field.name,
    doc: field.doc,
    deprecated: hasAnnotation(field, "deprecated"),
    inputFields: inputField?.typeRef.objectFields ?? [],
    outputFields: outputField?.typeRef.objectFields ?? [],
  };
}

function hasAnnotation(typeDefOrField: TypeDef | Field, name: string): boolean {
  return getAnnotation(typeDefOrField.annotations, name) !== undefined;
}
