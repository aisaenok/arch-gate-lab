import { get } from "../shared/http/client.js";

const client = { get };

export const load = (url: string) =>
  client.get(url);
