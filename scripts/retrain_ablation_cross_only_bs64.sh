#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "warning: scripts/retrain_ablation_cross_only_bs64.sh is deprecated."
echo "forwarding to scripts/retrain_ablation_cross_only_bs128.sh ..."
exec "${SCRIPT_DIR}/retrain_ablation_cross_only_bs128.sh"
