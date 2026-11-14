import axios from "axios";

const client = axios.create();

export async function getAdminData() {
  return client.get("/api/admin");
}
