package dev.archgate.lab;

import dev.archgate.lab.api.ApplicationResponse;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/api/applications")
public final class ApplicationController {
    @POST
    public ApplicationResponse createApplication(String name) {
        return new ApplicationResponse("created", "DRAFT");
    }

    @GET
    @Path("/{id}")
    public ApplicationResponse getApplication(String id) {
        return new ApplicationResponse(id, "APPROVED");
    }
}
