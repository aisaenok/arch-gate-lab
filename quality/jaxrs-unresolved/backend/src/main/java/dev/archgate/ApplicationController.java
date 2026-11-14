package dev.archgate;

import dev.archgate.generated.ApplicationApi;

public final class ApplicationController implements ApplicationApi {
    @Override
    public String getApplication(String id) {
        return id;
    }
}
