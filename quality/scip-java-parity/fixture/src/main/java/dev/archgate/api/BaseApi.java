package dev.archgate.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/api/applications")
public interface BaseApi {
    @GET
    @Path("/{id}")
    String getApplication(String id);
}
