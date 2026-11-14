---
name: OpenAPI validator compatibility
description: Compatibility constraint between this workspace's Orval-generated validators and installed Zod version.
---

When adding OpenAPI fields that generate Zod validators, do not use OpenAPI `integer` or `format: email` with the current toolchain. Orval generates `zod.int()` and `zod.email()`, which are unsupported by the workspace's Zod 3 package. Use numeric schemas and a compatible string pattern where appropriate, and enforce any stricter runtime semantics in the route.

**Why:** code generation completed but the generated library failed TypeScript validation because the generated Zod 4-style methods were unavailable.

**How to apply:** after changing `lib/api-spec/openapi.yaml`, run the workspace codegen command and inspect its generated validators before building the API package.
