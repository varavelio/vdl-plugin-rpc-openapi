import { definePlugin } from "@varavel/vdl-plugin-sdk";
import { generateOpenApi } from "./generate";

/**
 * SDK entrypoint for the OpenAPI plugin.
 */
export const generate = definePlugin((input) => generateOpenApi(input));
