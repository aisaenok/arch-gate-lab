# Generated runtime HTTP identification

These scenarios separate route identification from contract membership.

1. Direct dynamic fetch:
   ```ts
   fetch(url)
   ```
   The transport is known but the route is not. API004 should FAIL.

2. Fetch alias:
   ```ts
   const request = fetch;
   request(`/api/applications/${id}`);
   ```
   The route is statically identifiable, but the current analyzer may fail to recognize
   that `request` is the fetch transport at all.

3. Axios alias:
   ```ts
   import axios from "axios";
   const client = axios;
   client.get(`/api/applications/${id}`);
   ```
   Same issue for a configured HTTP module alias.

A missing `http-call` fact is more dangerous than an unresolved operation key: API004
cannot reject what the analyzer never recognized as HTTP.
