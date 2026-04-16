# Quadlet — Podman Systemd Containers

These files let you manage OqlOS containers as native systemd services via **Podman Quadlet**.

## Install

Copy to the Quadlet directory:

```bash
# System-wide (requires root)
sudo cp *.container *.network /etc/containers/systemd/

# User-level (rootless)
cp *.container *.network ~/.config/containers/systemd/
```

Reload systemd and start:

```bash
systemctl daemon-reload          # or: systemctl --user daemon-reload
systemctl start oqlos-traefik    # starts traefik
systemctl start oqlos-portal     # starts portal + api (via dependencies)
```

## Services

| Unit | Image | Port |
|---|---|---|
| `oqlos-traefik` | `traefik:v3.6.2` | 80, 443, 8080 |
| `oqlos-api` | `ghcr.io/softreck/oqlapi:latest` | 8101 (internal) |
| `oqlos-portal` | `ghcr.io/softreck/oqlos-portal:latest` | 80 (internal) |

## Network

All containers use the `oqlos` Podman network (`10.89.1.0/24`).

## Logs

```bash
journalctl -u oqlos-portal -f
journalctl -u oqlos-api -f
journalctl -u oqlos-traefik -f
```
