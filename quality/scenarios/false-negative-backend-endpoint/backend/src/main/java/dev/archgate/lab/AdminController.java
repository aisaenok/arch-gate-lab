package dev.archgate.lab;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/api/admin")
public final class AdminController {
    @GET
    public String getAdmin() {
        return "secret";
    }
}
