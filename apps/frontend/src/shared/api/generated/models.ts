// @generated from packages/api-contracts/openapi.yaml
export interface CreateApplicationRequest {
  name: string;
}

export interface ApplicationResponse {
  id: string;
  status: "DRAFT" | "APPROVED";
}
