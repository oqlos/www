export const INSTALL_DOCKER = (vars) => `# Clone the monorepo
git clone ${vars.repo}
cd oqlos

# Development mode (API + IDE + Traefik)
docker-compose -f infra/docker/dev/docker-compose.dev.yml up

# Access points:
#   API:       ${vars.apiUrl}
#   IDE:       ${vars.ideUrl}
#   Traefik:   ${vars.traefikUrl}

# Production mode (TLS + Let's Encrypt)
docker-compose -f infra/docker/prod/docker-compose.prod.yml up -d`;

export const INSTALL_PIP = `# Install OqlOS runtime
pip install oqlos

# Install CLI tool
pip install oql

# Install TestQL for API/GUI testing
pip install testql

# Verify installation
oqlctl --version
testql --version

# Run a scenario in dry-run (no hardware needed)
oqlctl run test-pompy.oql --mode dry-run

# Start interactive REPL
oqlctl shell`;

export const INSTALL_RPI = (vars) => `# On Raspberry Pi 3B+ / 4 / 5

# Option A: Docker agent
docker run -d \\
  --device=${vars.usbDevice} \\
  --device=${vars.i2cBus} \\
  -e AGENT_ID=rpi-node-01 \\
  -e API_WS_URL=${vars.wsUrl} \\
  -e HARDWARE_MODE=rpi \\
  ${vars.dockerImage}

# Option B: Native install
pip install oqlos oql
export OQLOS_HARDWARE_MODE=${vars.hwMode}
export MODBUS_SERIAL_PORT=${vars.modbusPort}
oqlos-server --port ${vars.agentPort}

# Hardware diagnostics
python -m oqlos.tools.hardware_diagnose --diagnose`;
