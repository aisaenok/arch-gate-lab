import { readFileSync, writeFileSync } from "node:fs";
import { fromBinary } from "@bufbuild/protobuf";
import { IndexSchema } from "@scip-code/scip";

const [, , input, output] = process.argv;

if (!input || !output) {
  throw new Error(
    "usage: node inspect-index.mjs <index.scip> <summary.json>"
  );
}

const index = fromBinary(
  IndexSchema,
  readFileSync(input)
);

const documents = index.documents.map((document) => {
  const implementationRelationships = document.symbols.flatMap(
    (symbol) =>
      symbol.relationships
        .filter((relationship) => relationship.isImplementation)
        .map((relationship) => ({
          symbol: symbol.symbol,
          target: relationship.symbol,
          isReference: relationship.isReference
        }))
  );

  const occurrenceSymbols = [...new Set(
    document.occurrences
      .map((occurrence) => occurrence.symbol)
      .filter(Boolean)
  )].sort();

  return {
    path: document.relativePath,
    occurrenceCount: document.occurrences.length,
    symbolCount: document.symbols.length,
    occurrenceSymbols,
    implementationRelationships
  };
});

const summary = {
  tool: index.metadata?.toolInfo
    ? {
        name: index.metadata.toolInfo.name,
        version: index.metadata.toolInfo.version,
        arguments: index.metadata.toolInfo.arguments
      }
    : null,
  projectRoot: index.metadata?.projectRoot ?? null,
  documentCount: index.documents.length,
  documents
};

writeFileSync(
  output,
  JSON.stringify(summary, null, 2) + "\n"
);

console.log(JSON.stringify(summary, null, 2));
