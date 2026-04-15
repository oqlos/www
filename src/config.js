const env = import.meta.env;

export const config = {
  github:     env.VITE_GITHUB_REPO        || "https://github.com/softreck/oqlos",
  api:        env.VITE_API_DEV_URL        || "http://api.oqlos.localhost",
  ide:        env.VITE_IDE_DEV_URL        || "http://ide.oqlos.localhost",
  traefik:    env.VITE_TRAEFIK_DEV_URL    || "http://localhost:8080",
  docker:     env.VITE_DOCKER_IMAGE       || "ghcr.io/softreck/oqlagent:latest",
  wsUrl:      env.VITE_API_WS_URL         || "wss://api.oqlos.io/ws/agent",
  hwMode:     env.VITE_HARDWARE_MODE      || "real",
  modbus:     env.VITE_MODBUS_SERIAL_PORT || "/dev/ttyACM1",
  i2c:        env.VITE_I2C_BUS            || "/dev/i2c-1",
  usb:        env.VITE_USB_DEVICE         || "/dev/ttyACM0",
  agentPort:  env.VITE_OQLAGENT_PORT      || "8200",
  copyright:  env.VITE_APP_COPYRIGHT      || "2024-2026",
};
