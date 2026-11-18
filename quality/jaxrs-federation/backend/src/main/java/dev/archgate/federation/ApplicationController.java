package dev.archgate.federation;

public final class ApplicationController implements ApplicationApi {
    @Override
    public String getApplication() {
        return "ok";
    }
}
