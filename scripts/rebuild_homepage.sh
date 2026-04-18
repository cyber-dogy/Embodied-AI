#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONDA_SH="/opt/miniconda3/etc/profile.d/conda.sh"

cd "${ROOT}"

# build 脚本优先走 mdit_env，这样需要抓 W&B history 时不会丢数据。
if [[ -f "${CONDA_SH}" ]]; then
  source "${CONDA_SH}"
  conda activate mdit_env
fi

python scripts/build_homepage_data.py
python scripts/build_cloudflare_pages_bundle.py
echo "Homepage payload 与 Cloudflare Pages 发布包已重建。"
