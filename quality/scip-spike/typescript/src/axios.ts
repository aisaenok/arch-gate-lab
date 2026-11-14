import axios from "axios";

const client = axios.create();
const get = client.get;

export const viaAxiosInstance = (url: string) =>
  client.get(url);

export const viaAxiosMethodAlias = (url: string) =>
  get(url);
