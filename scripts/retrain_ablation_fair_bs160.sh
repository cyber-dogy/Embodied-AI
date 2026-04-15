#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "warning: scripts/retrain_ablation_fair_bs160.sh is deprecated."
echo "forwarding to scripts/retrain_ablation_strict_fair_bs224.sh ..."
exec "${SCRIPT_DIR}/retrain_ablation_strict_fair_bs224.sh"
