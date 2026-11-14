# TypeScript dynamic dispatch characterization

The scenarios probe how much dispatch the TypeChecker already resolves for `http-reach`.

1. Object property alias:
   ```ts
   const client = { get };
   client.get(url);
   ```

2. Concrete class instance:
   ```ts
   const client = new HttpClient();
   client.get(url);
   ```

3. Interface-typed variable with concrete initializer:
   ```ts
   const client: HttpClient = new FetchClient();
   client.get(url);
   ```

4. Interface-typed function parameter:
   ```ts
   function load(client: HttpClient) {
     return client.get(url);
   }
   ```

The first two should remain rejected. The latter two characterize the boundary where
the static call signature may resolve only to an interface method rather than a
concrete executable implementation.
