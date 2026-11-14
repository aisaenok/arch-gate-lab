export interface HttpClient {
  get(url: string): Promise<unknown>;
}

export class FetchClient implements HttpClient {
  async get(url: string): Promise<unknown> {
    const response = await fetch(url);
    return response.json();
  }
}
