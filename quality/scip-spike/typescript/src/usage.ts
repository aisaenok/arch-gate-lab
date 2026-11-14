import { get } from "./barrel.js";
import {
  FetchClient,
  type HttpClient
} from "./types.js";

const request = get;

export const viaAlias = (url: string) =>
  request(url);

export const viaCallback = (urls: string[]) =>
  Promise.all(urls.map(get));

const client: HttpClient = new FetchClient();

export const viaInterface = (url: string) =>
  client.get(url);
