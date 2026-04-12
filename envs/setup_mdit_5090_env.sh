#!/usr/bin/env bash
set -euo pipefail

export TORCH_CHANNEL="${TORCH_CHANNEL:-cu130}"
"$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/setup_mdit_env.sh" "${1:-mdit_5090}"
