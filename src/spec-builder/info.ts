import type { PluginOptions } from "../options";

/**
 * Builds the OpenAPI `info` object while omitting empty optional sections.
 */
export function buildInfo(options: PluginOptions): Record<string, unknown> {
  const info: Record<string, unknown> = {
    title: options.title,
    version: options.version,
  };

  if (options.description) {
    info.description = options.description;
  }

  const contact: Record<string, unknown> = {};

  if (options.contactName) {
    contact.name = options.contactName;
  }

  if (options.contactEmail) {
    contact.email = options.contactEmail;
  }

  if (Object.keys(contact).length > 0) {
    info.contact = contact;
  }

  if (options.licenseName) {
    info.license = { name: options.licenseName };
  }

  return info;
}
