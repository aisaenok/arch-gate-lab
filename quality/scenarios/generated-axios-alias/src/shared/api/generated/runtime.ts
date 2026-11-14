import axios from "axios";

const client = axios;

export async function getAdminData() {
  return client.get("/api/admin");
}
