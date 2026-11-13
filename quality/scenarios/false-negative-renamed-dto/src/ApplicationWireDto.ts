// Same wire shape as ApplicationResponse, but deliberately renamed.
export interface ApplicationWireDto {
  id: string;
  status: "DRAFT" | "APPROVED";
}
