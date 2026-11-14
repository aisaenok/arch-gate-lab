import { HttpClient } from "../shared/http/HttpClient.js";

const client = new HttpClient();

export const load = (url: string) =>
  client.get(url);
