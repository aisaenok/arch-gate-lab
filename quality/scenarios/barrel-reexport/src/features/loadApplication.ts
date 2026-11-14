import { get } from "../shared/http/index.js";

export const loadApplication = (id: string) =>
  get(`/api/applications/${id}`);
