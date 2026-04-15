-- Test data initialization for OqlOS
-- This script creates test users, scenarios, and other data

-- Create test users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create test scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    oql_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test user
INSERT INTO users (email, role, plan) VALUES 
    ('test@test.com', 'admin', 'pro')
ON CONFLICT (email) DO UPDATE SET 
    role = 'admin',
    plan = 'pro',
    updated_at = CURRENT_TIMESTAMP;

-- Insert additional test users
INSERT INTO users (email, role, plan) VALUES 
    ('demo@oqlos.io', 'admin', 'pro'),
    ('user@oqlos.io', 'user', 'free')
ON CONFLICT (email) DO NOTHING;

-- Insert test scenarios for test user
INSERT INTO scenarios (user_id, name, description, oql_code) VALUES 
    ((SELECT id FROM users WHERE email = 'test@test.com'), 'Test Scenario 1', 'Basic pump control', 
     'SCENARIO: "Test Pump Control"\nGOAL: Auto\n  SET ''pompa 1'' ''2 l/min''\n  WAIT 2000ms'),
    ((SELECT id FROM users WHERE email = 'test@test.com'), 'Test Scenario 2', 'Temperature monitoring',
     'SCENARIO: "Temperature Monitor"\nGOAL: Auto\n  GET ''temp_sensor_1''\n  ASSERT > 20\n  WAIT 1000ms')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO test_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO test_user;
