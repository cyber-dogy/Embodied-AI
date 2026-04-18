# Caddy Homepage Stack

这套部署分成两种模式：

- `Caddyfile.user`：当前机器可直接启用的用户态方案，不需要 sudo，默认监听 `:18080`
- `Caddyfile.domain`：给有公网域名、80/443 权限和正式服务器的生产方案

## 当前机器可直接用

安装并启用用户态服务：

```bash
cd /home/gjw/MyProjects/autodl_unplug_charger_transformer_fm
bash scripts/setup_homepage_user_caddy.sh
```

默认会启动两条 user service：

- `gjw-homepage-server.service`
- `gjw-homepage-caddy.service`

注意：这两条是 `systemd --user` 服务。
如果这台机器没有开启 `linger`，那么它们会在当前用户完整退出登录后停止。
真正的无人值守长期运行，仍然推荐放到公网服务器上做系统级 Caddy + systemd 服务。

默认访问地址：

```text
http://127.0.0.1:18080/
```

如果这台机器本身有公网 IP，或者路由器已经把 `18080/tcp` 做了端口转发，那么外网也可以直接访问：

```text
http://<你的公网IP>:18080/
```

## 正式外网方案

真正“长期稳定”的正式方案建议是：

1. 一台公网 Linux 服务器
2. 一个域名指向这台服务器
3. 用系统级 Caddy 跑 `Caddyfile.domain`
4. homepage Python 静态服务继续只绑定 `127.0.0.1:43429`

这样外网直接通过：

```text
https://your-domain.com
```

访问，而不是暴露 Python 服务本身。

## 当前机器的限制

当前这台机器如果没有公网 IPv4，或者没有做端口转发，那么光有 Caddy 也不能让“互联网浏览器”直接访问到你本机。

换句话说，Caddy 解决的是：

- 反向代理
- 压缩
- 长期守护
- HTTPS（在正式服务器上）

但它不解决：

- 家宽 NAT
- 没有公网 IP
- 云服务器安全组没放行

如果以后你要把这套直接发到公网，我建议把同一个 repo 放到公网服务器，再套 `Caddyfile.domain`。
