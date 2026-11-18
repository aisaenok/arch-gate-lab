package dev.archgate.federation;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/applications")
public interface ApplicationApi {
    @GET
    @Path("/{id}")
    String getApplication();
}
