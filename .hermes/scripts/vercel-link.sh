#!/bin/bash
set -e
# Read VERCEL_TOKEN directly from env (not interpolated by the tool)
cd "$(dirname "$0")/../.."
vercel whoami 2>&1
echo "---"
# Try to list projects
VERCEL_TOKEN_VALUE="${VE...N}"
if [ -n "$VERCEL_TOKEN_VALUE" ]; then
  vercel --token "$VERCEL_TOKEN_VALUE" whoami 2>&1
else
  echo "VERCEL_TOKEN is empty or unset"
fi