export class HttpClient {
  async get(url: string) {
    const response = await fetch(url);
    return response.json();
  }
}
