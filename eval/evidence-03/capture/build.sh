#!/bin/bash
# Run LAST, after every capture. Then confirm the dev server on :3000 still answers.
cd /Users/mengyahao/Desktop/knowunity-sprint || exit 1
L=eval/evidence-03/logs
( npm run build 2>&1; echo "EXIT=$?" ) > $L/build.txt
echo "dev server after build: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/)" | tee $L/dev-server-after-build.txt
