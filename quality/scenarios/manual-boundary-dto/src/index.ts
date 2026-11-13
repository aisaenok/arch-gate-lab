import {
  createApplication
} from "../../../../apps/frontend/src/shared/api/generated/runtime.js";

interface CreateApplicationPayload {
  name: string;
}

export async function create(name: string) {
  const request: CreateApplicationPayload = { name };
  return createApplication(request);
}
