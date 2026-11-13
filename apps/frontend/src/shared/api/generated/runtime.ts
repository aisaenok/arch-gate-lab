// @generated from packages/api-contracts/openapi.yaml
import type {
  ApplicationResponse,
  CreateApplicationRequest
} from "./models.js";

export async function createApplication(
  request: CreateApplicationRequest
): Promise<ApplicationResponse> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<ApplicationResponse>;
}

export async function getApplication(id: string): Promise<ApplicationResponse> {
  const response = await fetch(`/api/applications/${id}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<ApplicationResponse>;
}
