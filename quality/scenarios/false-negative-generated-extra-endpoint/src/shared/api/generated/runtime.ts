// Deliberately hand-written file placed in a directory trusted as generated.
export async function getAdminData() {
  return fetch("/api/admin");
}
