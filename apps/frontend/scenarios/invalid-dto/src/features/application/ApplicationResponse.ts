import {
  createApplication
} from "../../../../../src/shared/api/generated/runtime.js";

interface CreateApplicationPayload {
  name: string;
}

export async function createInvalidApplication(name: string) {
  const request: CreateApplicationPayload = { name };
  return createApplication(request);
}
