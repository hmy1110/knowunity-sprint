#!/bin/bash
# Command logs for evidence-02. Writes eval/evidence-02/logs/*. Build is run separately (build.sh), last.
cd /Users/mengyahao/Desktop/knowunity-sprint || exit 1
L=eval/evidence-02/logs
G() { grep -rnE --exclude='*.stories.tsx' --exclude='*.stories.ts' --exclude='*.mdx' -e "$1" src; }
( npm run check:tokens 2>&1; echo "EXIT=$?" ) > $L/check-tokens.txt
( npm run lint 2>&1; echo "EXIT=$?" ) > $L/lint.txt
( G 'rgba\(|hsla\('; echo "EXIT(grep)=$?" ) > $L/grep-rgba-hsla.txt
( G '#[0-9a-fA-F]{3,8}\b'; echo "EXIT(grep)=$?" ) > $L/grep-hex-all-lines.txt
( G 'var\(--[a-zA-Z0-9-]+,'; echo "EXIT(grep)=$?" ) > $L/grep-var-fallback.txt
( G '--color-primitives-'; echo "EXIT(grep)=$?" ) > $L/grep-primitives.txt
# grep-hex-raw.txt: hex literals on lines that are not comment-only. This reproduces run 1's grep-hex-raw.txt result on run 1's tree (2 lines). grep-hex-all-lines.txt: every line incl. comments.
( G '#[0-9a-fA-F]{3,8}\b' | grep -Ev '^[^:]+:[0-9]+:[[:space:]]*(//|\*|/\*)'; echo "EXIT(grep)=${PIPESTATUS[1]}" ) > $L/grep-hex-raw.txt
