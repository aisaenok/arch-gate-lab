# Generated runtime HTTP identification

These scenarios separate route identification from transport identification.

## Direct dynamic route

```ts
fetch(url)
```

The transport is known but the route is not. API004 must reject it.

## Fetch alias

```ts
const request = fetch;
request("/api/admin");
```

The route is statically known, but `/api/admin` is absent from OpenAPI. The analyzer
must preserve fetch provenance through the alias so API003 can reject the extra
generated endpoint.

## Configured module alias

```ts
import axios from "axios";
const client = axios;
client.get("/api/admin");
```

The same requirement applies to configured HTTP modules. A transport alias must not
make the generated call disappear from `http-call`.

This distinction matters because API004 can only validate calls that exist as facts;
transport identification must happen before route/contract rules can do their job.
