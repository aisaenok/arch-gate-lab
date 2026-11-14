import { get } from "../shared/http/client.js";

const request = get;

export const loadApplication = (id: string) =>
  request(`/api/applications/${id}`);
