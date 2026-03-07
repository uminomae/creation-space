#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
python3 serve.py "${1:-3001}"
