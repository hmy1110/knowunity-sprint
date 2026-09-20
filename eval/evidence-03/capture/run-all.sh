#!/bin/bash
# Reproduces evidence-03 end to end against the dev server on http://localhost:3000 (must already be running).
# Order matters: build is last so it cannot disturb the captures.
set -e
cd /Users/mengyahao/Desktop/knowunity-sprint
node eval/evidence-03/capture/capture.mjs      # screens/, gray/, measure/, aria/, manifest.json, logs/console.json
node eval/evidence-03/capture/analyze.mjs      # pixel-diffs, contrast, hit-areas, structure, tag-fills, submit pair
node eval/evidence-03/capture/compare.mjs      # measure/run-comparison.json, diffs/vs-run2/
bash eval/evidence-03/capture/logs.sh          # check:tokens, lint, greps
bash eval/evidence-03/capture/build.sh         # npm run build, then curl :3000
node eval/evidence-03/capture/changes-md.mjs   # CHANGES-SINCE-RUN-2.md (reads the build log)
