package dev.archgate.lab;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/api/broken")
public final class BrokenResource {
    @GET
    public String broken( {
        return "broken";
    }
}
