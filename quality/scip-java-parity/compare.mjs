import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  analyzeJavaRepository
} from "../../.tools/arch-gate/dist/src/analyzers/java.js";
import {
  buildArchitectureModel
} from "../../.tools/arch-gate/dist/src/engine.js";
import {
  compareJavaImplementationParityWithScip
} from "../../.tools/arch-gate/dist/src/scip/java-shadow.js";
import {
  loadScipIndex
} from "../../.tools/arch-gate/dist/src/scip/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(here, "fixture");

const repository = {
  id: "backend",
  type: "java",
  root: fixtureRoot,
  roles: ["api-provider"],
  sourceDirs: [path.join(fixtureRoot, "src/main/java")],
  frameworks: ["jax-rs"]
};

const resolutions = [];
const endpoints = [];

const analysis = await analyzeJavaRepository(repository, {
  onImplementationResolution: (resolution) => {
    resolutions.push(resolution);
  },
  onInterfaceEndpoint: (endpoint) => {
    endpoints.push(endpoint);
  }
});

const scip = await loadScipIndex(
  path.join(fixtureRoot, "index.scip")
);

const parity = compareJavaImplementationParityWithScip(
  resolutions,
  endpoints,
  scip
);

const missed = parity.scipToManual.mismatches.filter(
  (mismatch) => mismatch.reason === "manual-resolution-missing"
);

const summary = {
  manualEndpointFacts: analysis.facts.length,
  manualImplementationResolutions: resolutions.length,
  interfaceEndpointCandidates: endpoints.length,
  parity,
  missedImplementations: missed.map((mismatch) => ({
    interface: `${mismatch.endpoint.interfaceFqn}#${mismatch.endpoint.interfaceMethodName}`,
    implementationSourceFile:
      mismatch.implementationSourceFile,
    implementationDefinitionLine:
      mismatch.implementationDefinitionLine,
    implementationSymbol: mismatch.implementationSymbol
  }))
};

console.log(JSON.stringify(summary, null, 2));

assert.equal(
  analysis.facts.length,
  0,
  "manual Java resolver unexpectedly learned interface inheritance"
);
assert.equal(
  resolutions.length,
  0,
  "manual Java resolver unexpectedly resolved inherited interface endpoint"
);
assert.equal(
  endpoints.length,
  1,
  "expected one JAX-RS interface endpoint candidate"
);
assert.ok(
  parity.scipToManual.implementationsChecked >= 1,
  "SCIP did not expose a local implementation for the inherited interface method"
);
assert.ok(
  missed.length >= 1,
  "expected SCIP to expose an implementation missed by the manual resolver"
);


const authoritativeRepository = {
  ...repository,
  scipIndexFile: path.join(fixtureRoot, "index.scip")
};

const authoritativeModel = await buildArchitectureModel({
  configFile: "scip-java-parity",
  repositories: {
    backend: authoritativeRepository
  },
  relations: [],
  rules: []
});

const authoritativeFacts = authoritativeModel.facts.filter(
  (fact) => fact.kind === "backend-endpoint"
);

console.log(
  JSON.stringify(
    {
      authoritativeFacts,
      authoritativeDiagnostics:
        authoritativeModel.diagnostics ?? [],
      authoritativeEvidence:
        authoritativeModel.evidence
    },
    null,
    2
  )
);

assert.equal(
  authoritativeFacts.length,
  1,
  "SCIP-authoritative normal pipeline must emit the inherited endpoint"
);
assert.equal(
  authoritativeFacts[0]?.className,
  "ApplicationController"
);
assert.equal(
  authoritativeFacts[0]?.operationKey,
  "GET /api/applications/{}"
);
assert.equal(
  authoritativeFacts[0]?.sourceFile,
  "src/main/java/dev/archgate/ApplicationController.java"
);
assert.equal(
  authoritativeModel.evidence[0]?.status,
  "complete"
);
assert.ok(
  (authoritativeModel.diagnostics ?? []).some(
    (diagnostic) =>
      diagnostic.code ===
      "SCIP_JAVA_MANUAL_RESOLUTION_MISSING"
  ),
  "shadow diagnostic must still record the legacy resolver false negative"
);
