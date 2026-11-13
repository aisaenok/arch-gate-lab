import { get } from "../shared/http/client.js";

// Architecture violation: feature reaches backend through a custom wrapper,
// not through the generated runtime.
export const loadApplication = (id: string) =>
  get(`/api/applications/${id}`);
