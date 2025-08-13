#!/bin/bash
cd /home/kavia/workspace/code-generation/crypto-insights-hub-158305-158314/crypto_edu_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

