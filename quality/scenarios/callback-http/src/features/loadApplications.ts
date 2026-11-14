import { get } from "../shared/http/client.js";

export const loadApplications = (urls: string[]) =>
  Promise.all(urls.map(get));
