import { get } from "../shared/http/client.js";

// Import exists, but the HTTP wrapper is never called.
// Architecture gate should not infer HTTP reachability from the import alone.
export const loadApplication = (id: string) => ({
  id,
  load: get
});
