import { http } from "./axios-barrel.js";

export const viaReexport = (url: string) =>
  http.get(url);
