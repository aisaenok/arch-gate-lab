package dev.archgate.payments;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

// Deliberately wrong: payments backend exposes the orders endpoint.
@Path("/api/orders")
public final class PaymentsResource {
    @GET
    @Path("/{id}")
    public String getOrder(String id) {
        return id;
    }
}
