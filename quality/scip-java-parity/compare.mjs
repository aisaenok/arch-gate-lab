import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  analyzeJavaRepository
} from "../../.tools/arch-gate/dist/src/analyzers/java.js";
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
