const request = fetch;

export async function getAdminData() {
  return request("/api/admin");
}
