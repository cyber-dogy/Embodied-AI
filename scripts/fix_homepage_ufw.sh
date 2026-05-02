#!/usr/bin/env bash
set -euo pipefail

# 只放行当前局域网到 homepage 相关端口，避免把高位端口直接完全暴露给所有来源。
LAN_CIDR="${1:-192.168.5.0/24}"

echo "[homepage] 准备放行局域网 ${LAN_CIDR} 访问 43429 / 18080 ..."

sudo ufw allow from "${LAN_CIDR}" to any port 43429 proto tcp comment 'homepage lan 43429'
sudo ufw allow from "${LAN_CIDR}" to any port 18080 proto tcp comment 'homepage lan 18080'

echo
echo "[homepage] 当前相关规则："
sudo ufw status numbered | sed -n '1,200p'

echo
echo "[homepage] 放行完成后，可从局域网设备访问："
echo "  http://192.168.5.135:43429/homepage/"
echo "  http://192.168.5.135:18080/homepage/"
