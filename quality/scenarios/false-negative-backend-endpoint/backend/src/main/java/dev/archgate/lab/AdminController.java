package dev.archgate.lab;

// Deliberately illustrative: the current arch-gate has no Java endpoint analyzer.
public final class AdminController {
    // Equivalent architectural intent: GET /api/admin, absent from OpenAPI.
    public String getAdmin() {
        return "secret";
    }
}
