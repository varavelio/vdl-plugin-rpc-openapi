<p align="center">
  <img
    src="https://raw.githubusercontent.com/varavelio/vdl/9cb8432f972f986ba91ffa1e4fe82220a8aa373f/assets/png/vdl.png"
    alt="VDL logo"
    width="130"
  />
</p>

<h1 align="center">VDL RPC OpenAPI Plugin</h1>

<p align="center">
  Generate OpenAPI 3.0 specifications for <strong>VDL RPC</strong> <strong>procedures</strong> and <strong>streams</strong>.
</p>

This plugin converts your VDL RPC schema into an OpenAPI document that can be used by API gateways, API clients (e.g. Postman), documentation tooling, contract validation workflows, and code generation pipelines.

It is RPC-focused.

Use it when you want to:

- publish a standard OpenAPI contract for your VDL RPC layer
- expose request and response schemas for procedures and streams
- keep API docs synchronized with your source-of-truth VDL definitions
- integrate your RPC APIs with OpenAPI-compatible tooling
- import all the VDL RPC requests in an API client like Postman

## Quick Start

1. Add the plugin to your `vdl.config.vdl`:

```vdl
const config = {
  version 1
  plugins [
    {
      src "varavelio/vdl-plugin-rpc-openapi@v0.1.0"
      schema "./schema.vdl"
      outDir "./gen"
    }
  ]
}
```

2. Run your normal generation command:

```bash
vdl generate
```

3. Check the generated output in `./gen`:

## Plugin Options

All options are optional.

| Option         | Type     | Default          | What it changes                                                                                        |
| -------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| `outFile`      | `string` | `"openapi.yaml"` | Output filename inside `outDir`. Extension controls format: `.yaml`/`.yml` for YAML, `.json` for JSON. |
| `title`        | `string` | `"VDL RPC API"`  | Sets `info.title` in the generated OpenAPI document.                                                   |
| `version`      | `string` | `"1.0.0"`        | Sets `info.version` in the generated OpenAPI document.                                                 |
| `description`  | `string` | `""`             | Sets `info.description` when provided.                                                                 |
| `baseUrl`      | `string` | `""`             | Adds a `servers` entry (`servers[0].url`) when provided.                                               |
| `contactName`  | `string` | `""`             | Sets `info.contact.name` when provided.                                                                |
| `contactEmail` | `string` | `""`             | Sets `info.contact.email` when provided.                                                               |
| `licenseName`  | `string` | `""`             | Sets `info.license.name` when provided.                                                                |

Example with all options:

```vdl
const config = {
  version 1
  plugins [
    {
      src "varavelio/vdl-plugin-rpc-openapi@v0.1.0"
      schema "./schema.vdl"
      outDir "./gen"
      options {
        outFile "openapi.json"
        title "Messaging API"
        version "2.1.0"
        description "Public RPC contract for messaging services"
        baseUrl "https://api.example.com/rpc"
        contactName "Platform API Team"
        contactEmail "api@example.com"
        licenseName "MIT"
      }
    }
  ]
}
```

## RPC Annotation Model

This plugin reads RPC operations from the standard VDL RPC annotations:

- `@rpc` marks a top-level service type
- `@proc` marks a request/response operation
- `@stream` marks a SSE stream operation

Example:

```vdl
@rpc
type ChatService {
  @proc
  sendMessage {
    input {
      roomId string
      text string
    }

    output {
      accepted bool
    }
  }

  @stream
  events {
    input {
      roomId string
    }

    output {
      text string
      createdAt datetime
    }
  }
}
```

## What You Get

- OpenAPI document version `3.0.0`.
- A global `AuthToken` security scheme using the `Authorization` header.
- Tag groups per RPC service and operation kind (`<Service>Procedures`, `<Service>Streams`).
- One `POST` path per operation with route pattern `/<RpcTypeName>/<operationName>`.
- Reusable request bodies and responses under `components.requestBodies` and `components.responses`.
- All non-RPC VDL types and enums emitted under `components.schemas`.

## Response Envelope Behavior

Operation responses are wrapped in a consistent envelope:

- `ok` (`boolean`) always present
- `output` object with your declared output fields
- `error` object with at least `message` and optional metadata

For `@proc` operations, the media type is `application/json`.

For `@stream` operations, the media type is `text/event-stream`.

## Notes

- If there are no valid RPC operations in your schema, the plugin still generates a valid OpenAPI document skeleton (with `info`, `security`, and `components`).

## License

This plugin is released under the MIT License. See [LICENSE](LICENSE).
