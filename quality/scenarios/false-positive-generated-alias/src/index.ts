import type {
  CreateApplicationRequest
} from "../../../../apps/frontend/src/shared/api/generated/models.js";
import {
  createApplication
} from "../../../../apps/frontend/src/shared/api/generated/runtime.js";

type RequestAlias = CreateApplicationRequest;

export async function create(name: string) {
  const request: RequestAlias = { name };
  return createApplication(request);
}
