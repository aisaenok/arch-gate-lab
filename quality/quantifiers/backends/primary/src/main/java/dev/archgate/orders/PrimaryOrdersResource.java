package dev.archgate.orders;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/api/orders")
public final class PrimaryOrdersResource {
    @GET
    @Path("/{id}")
    public String getOrder(String id) {
        return id;
    }
}
