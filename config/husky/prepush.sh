#/bin/bash

set -eo pipefail

cat ./assets/lambcycle.txt
echo "\n 🐑🛵 A declarative lambda middleware with life cycle hooks 🐑🛵 \n"

npm run fmt
npm run lint
npm run test:coverage
