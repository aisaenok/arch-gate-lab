# JAX-RS generated interface inheritance

A generated JAX-RS interface can carry the endpoint annotations while the concrete
controller only implements the interface:

```java
@Path("/api/applications")
public interface ApplicationApi {
    @GET
    @Path("/{id}")
    String getApplication(String id);
}

public final class ApplicationController implements ApplicationApi {
    @Override
    public String getApplication(String id) { ... }
}
```

The current analyzer scans interfaces as `backend-endpoint` producers. That means an
annotated interface **without any concrete implementation** satisfies reverse contract
coverage and produces a false PASS.

Correct semantics:

- interface-only declaration -> FAIL API006;
- concrete class implementing the annotated interface method -> PASS;
- the emitted `backend-endpoint` should represent the concrete implementation while
  inheriting method/path metadata from the interface.
