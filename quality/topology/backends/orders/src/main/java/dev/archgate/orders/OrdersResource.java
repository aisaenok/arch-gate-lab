package dev.archgate.orders;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

// Deliberately wrong: orders backend exposes the payments endpoint.
@Path("/api/payments")
public final class OrdersResource {
    @GET
    @Path("/{id}")
    public String getPayment(String id) {
        return id;
    }
}
