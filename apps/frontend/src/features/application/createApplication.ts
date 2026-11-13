import type { CreateApplicationRequest } from "../../shared/api/generated/models.js";
import { createApplication } from "../../shared/api/generated/runtime.js";
import { mapApplication } from "../../entities/application/mapper.js";

export async function createNamedApplication(name: string) {
  const request: CreateApplicationRequest = { name };
  return mapApplication(await createApplication(request));
}
