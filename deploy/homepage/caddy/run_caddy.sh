#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
ENV_FILE="${HOME}/.config/gjw-homepage/caddy.env"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "缺少 ${ENV_FILE}，请先运行 scripts/setup_homepage_user_caddy.sh"
  exit 1
fi

# 这里直接 source 用户配置，确保 Caddyfile 和二进制路径都走同一份环境变量。
set -a
source "${ENV_FILE}"
set +a

if [[ -z "${CADDY_BIN:-}" || ! -x "${CADDY_BIN}" ]]; then
  echo "CADDY_BIN 未配置或不可执行: ${CADDY_BIN:-<empty>}"
  exit 1
fi

if [[ -z "${HOMEPAGE_CADDYFILE:-}" || ! -f "${HOMEPAGE_CADDYFILE}" ]]; then
  echo "HOMEPAGE_CADDYFILE 未配置或不存在: ${HOMEPAGE_CADDYFILE:-<empty>}"
  exit 1
fi

cd "${ROOT}"
exec "${CADDY_BIN}" run --config "${HOMEPAGE_CADDYFILE}" --adapter caddyfile
