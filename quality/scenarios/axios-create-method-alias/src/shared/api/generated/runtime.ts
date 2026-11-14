import axios from "axios";

const client = axios.create();
const get = client.get;

export async function getAdminData() {
  return get("/api/admin");
}
