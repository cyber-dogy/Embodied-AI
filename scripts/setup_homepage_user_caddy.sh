#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CADDY_VERSION="${CADDY_VERSION:-2.10.2}"
INSTALL_DIR="${HOME}/.local/share/gjw-homepage/caddy"
CONFIG_DIR="${HOME}/.config/gjw-homepage"
SYSTEMD_USER_DIR="${HOME}/.config/systemd/user"
ENV_FILE="${CONFIG_DIR}/caddy.env"
CADDY_BIN="${INSTALL_DIR}/caddy"
SERVICE_SERVER="${SYSTEMD_USER_DIR}/gjw-homepage-server.service"
SERVICE_CADDY="${SYSTEMD_USER_DIR}/gjw-homepage-caddy.service"

mkdir -p "${INSTALL_DIR}" "${CONFIG_DIR}" "${SYSTEMD_USER_DIR}"

if [[ ! -x "${CADDY_BIN}" ]]; then
  TMP_DIR="$(mktemp -d)"
  trap 'rm -rf "${TMP_DIR}"' EXIT
  ARCHIVE="${TMP_DIR}/caddy.tar.gz"
  curl -fsSL "https://github.com/caddyserver/caddy/releases/download/v${CADDY_VERSION}/caddy_${CADDY_VERSION}_linux_amd64.tar.gz" -o "${ARCHIVE}"
  tar -xzf "${ARCHIVE}" -C "${TMP_DIR}" caddy
  install -m 0755 "${TMP_DIR}/caddy" "${CADDY_BIN}"
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  cat > "${ENV_FILE}" <<EOF
HOMEPAGE_SITE=:18080
HOMEPAGE_UPSTREAM=127.0.0.1:43429
CADDY_BIN=${CADDY_BIN}
HOMEPAGE_CADDYFILE=${ROOT}/deploy/homepage/caddy/Caddyfile.user
EOF
fi

cat > "${SERVICE_SERVER}" <<EOF
[Unit]
Description=GJW Homepage Static Server
After=network.target

[Service]
Type=simple
WorkingDirectory=${ROOT}
ExecStart=/usr/bin/env python3 scripts/serve_homepage.py --bind 127.0.0.1 --port 43429
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
EOF

cat > "${SERVICE_CADDY}" <<EOF
[Unit]
Description=GJW Homepage Caddy Reverse Proxy
After=network-online.target gjw-homepage-server.service
Wants=network-online.target gjw-homepage-server.service

[Service]
Type=simple
WorkingDirectory=${ROOT}
EnvironmentFile=${ENV_FILE}
ExecStart=${ROOT}/deploy/homepage/caddy/run_caddy.sh
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable --now gjw-homepage-server.service
systemctl --user enable --now gjw-homepage-caddy.service

echo ""
echo "用户态 homepage 服务已经启动："
echo "  http://127.0.0.1:18080/"
echo ""
echo "如果这台机器本身有公网 IP，或者已经做了端口转发，外网也可以直接访问："
echo "  http://<你的公网IP>:18080/"
echo ""
echo "当前环境文件：${ENV_FILE}"
echo "可用命令："
echo "  systemctl --user status gjw-homepage-server.service"
echo "  systemctl --user status gjw-homepage-caddy.service"
echo "  systemctl --user restart gjw-homepage-server.service gjw-homepage-caddy.service"
