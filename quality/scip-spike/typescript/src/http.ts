export async function get(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();
}
