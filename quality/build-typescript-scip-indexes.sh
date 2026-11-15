#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: $0 <typescript-project> [...]" >&2
  exit 2
fi

for project in "$@"; do
  if [ ! -d "$project/src" ]; then
    echo "missing TypeScript fixture source directory: $project/src" >&2
    exit 1
  fi

  if grep -Rqs 'from "axios"' "$project/src" ||
     grep -Rqs "from 'axios'" "$project/src"; then
    (
      cd "$project"
      npm install --no-save axios@1.7.9
    )
  fi

  if [ ! -f "$project/tsconfig.json" ]; then
    cat > "$project/tsconfig.json" <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
JSON
  fi

  (
    cd "$project"
    scip-typescript index
    test -s index.scip
  )
done
