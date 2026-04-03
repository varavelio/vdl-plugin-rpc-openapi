import type { Annotation } from "@varavel/vdl-plugin-sdk";
import { getAnnotation, unwrapLiteral } from "@varavel/vdl-plugin-sdk/utils/ir";

export function hasDeprecatedAnnotation(annotations: Annotation[]): boolean {
  return getAnnotation(annotations, "deprecated") !== undefined;
}

export function getDeprecatedMessage(
  annotations: Annotation[],
): string | undefined {
  const deprecatedAnnotation = getAnnotation(annotations, "deprecated");

  if (!deprecatedAnnotation) {
    return undefined;
  }

  if (!deprecatedAnnotation.argument) {
    return "";
  }

  const value = unwrapLiteral(deprecatedAnnotation.argument);
  return typeof value === "string" ? value : String(value);
}
