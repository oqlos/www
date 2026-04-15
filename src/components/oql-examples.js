export const OQL_EXAMPLES = {
  "pump-test": {
    title: "Test Pompy / Pump Test",
    lang: "oql",
    code: `SCENARIO: "Pump Flow Test"
DEVICE_TYPE: "BA"
DEVICE_MODEL: "PSS 7000"
MANUFACTURER: "Dräger"

GOAL: Test przepływu
  # 1. Start pump at 2 l/min
    SET 'pompa 1' '2 l/min'
    WAIT 2000ms
  # 2. Reverse flow direction
    SET 'pompa 1' '-2 l/min'
    WAIT 2000ms
  # 3. Stop pump
    SET 'pompa 1' '0'`,
  },
  "mask-leak": {
    title: "Test Szczelności / Leak Test",
    lang: "oql",
    code: `SCENARIO: "Mask Leak Test"
DEVICE_TYPE: "BA"
DEVICE_MODEL: "FPS 7000"
MANUFACTURER: "Dräger"

GOAL: Pressure Seal Verification
  SET 'PUMP' 'off'
  SET 'zawór 2' '1'
  SET 'PUMP' '5 l'
  WAIT 7000ms
  MIN 'AI01' '-11.0 mbar'
  VAL 'AI01' 'mbar'
  IF 'AI01' < '-11.0 mbar' ELSE ERROR 'Vacuum too low'
  SAVE 'AI01'

GOAL: Overpressure Check
  MAX 'AI01' '-9.0 mbar'
  IF 'AI01' > '-9.0 mbar' ELSE ERROR 'Seal failure'
  SAVE 'AI01'
  SET 'PUMP' '10 l'
  WAIT 5000ms
  MIN 'AI01' '4.2 mbar'
  MAX 'AI01' '6.0 mbar'
  SAVE 'AI01'`,
  },
  "hw-diagnostics": {
    title: "Diagnostyka HW / Diagnostics",
    lang: "oql",
    code: `SCENARIO: "Hardware Diagnostics"
DEVICE_TYPE: "TEST_EQUIPMENT"

GOAL: Detect and validate hardware
  LOG "Detecting USB/serial peripherals..."
  EXPECT_DEVICE "/dev/ttyACM0" "CH340" "Modbus RTU"
  EXPECT_I2C_BUS "/dev/i2c-1"
  EXPECT_I2C_CHIP "0x48" "ADS1115 ADC"

  API_GET "/api/v1/hardware/health"
  ASSERT_STATUS 200
  ASSERT_JSON "mode" "real"
  ASSERT_JSON "piadc" "ok"
  ASSERT_JSON "motor" "ok"

  # Test pump
  SET "pompa" "2"
  WAIT 500ms
  ASSERT_SENSOR "sc-sensor" ">" "1" "mbar"
  SET "pompa" "0"

  # Test valves
  SET "zawor NC" "ON"
  WAIT 200ms
  ASSERT_VALVE "valve-nc" "True"
  SET "zawor NC" "OFF"

  LOG "Hardware diagnostics complete!"`,
  },
  "api-test": {
    title: "Test API / TestQL",
    lang: "iql",
    code: `# TestQL — API & GUI Test Scenario
SET api_url "http://localhost:8101"

LOG "Starting API test suite"

# Test device listing
API GET "\${api_url}/api/v3/data/devices"
ASSERT_STATUS 200
ASSERT_CONTAINS "device"
ASSERT_JSON data.length > 0

# Test scenario registration
API POST "\${api_url}/api/v3/scenarios" {
  "id": "ts-pump-001",
  "name": "Pump Flow Test"
}
ASSERT_STATUS 201

# GUI Navigation Test
NAVIGATE "/connect-workshop"
WAIT 500
CLICK "[data-action='search']"
INPUT "#search-input" "drager"
ASSERT_VISIBLE "[data-testid='results']"
ASSERT_TEXT "#status" "Connected"`,
  },
  "session-record": {
    title: "Nagrywanie Sesji / Record",
    lang: "iql",
    code: `# Session Recording & Replay
RECORD_START "demo-session-001"
LOG "Recording started" {"level": "info"}

# Device identification
NAVIGATE "/connect-id/device-rfid"
SELECT_DEVICE "d-demo-001" {
  "type": "PSS-7000",
  "serial": "PS12345"
}

# Start test interval
NAVIGATE "/connect-test/testing"
SELECT_INTERVAL "3m" {
  "code": "periodic_3m",
  "description": "3 miesiące"
}

# Execute test steps
START_TEST "ts-demo" {"name": "Demo", "steps": 3}
STEP_COMPLETE "step-1" {"name": "Init", "status": "passed"}
WAIT 200
STEP_COMPLETE "step-2" {
  "name": "Pressure",
  "status": "passed",
  "value": "15.2 mbar"
}
STEP_COMPLETE "step-3" {"name": "Final", "status": "passed"}

RECORD_STOP
# REPLAY "session-id" {"variables": {...}}`,
  },
};
