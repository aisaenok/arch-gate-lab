package dev.archgate.orders;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/api/orders")
public final class BrokenResource {
    @GET
    @Path("/{id}")
    public String getOrder( {
        return "broken";
    }
}
