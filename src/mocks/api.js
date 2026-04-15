const MOCK_ENABLED = !import.meta.env.VITE_BACKEND_URL;

// Test data store
const TEST_USERS = {
  'test@test.com': {
    id: 1,
    email: 'test@test.com',
    role: 'admin',
    plan: 'pro',
    created_at: new Date().toISOString()
  },
  'demo@oqlos.io': {
    id: 2,
    email: 'demo@oqlos.io',
    role: 'admin',
    plan: 'pro',
    created_at: new Date().toISOString()
  },
  [import.meta.env.VITE_DEMO_USER_EMAIL || 'demo@oqlos.com']: {
    id: 3,
    email: import.meta.env.VITE_DEMO_USER_EMAIL || 'demo@oqlos.com',
    name: import.meta.env.VITE_DEMO_USER_NAME || 'Demo User',
    role: import.meta.env.VITE_DEMO_USER_ROLE || 'user',
    plan: 'free',
    created_at: new Date().toISOString()
  }
};

const TEST_SCENARIOS = {
  1: [
    {
      id: 1,
      name: 'Test Scenario 1',
      description: 'Basic pump control',
      oql_code: 'SCENARIO: "Test Pump Control"\nGOAL: Auto\n  SET \'pompa 1\' \'2 l/min\'\n  WAIT 2000ms'
    },
    {
      id: 2,
      name: 'Test Scenario 2',
      description: 'Temperature monitoring',
      oql_code: 'SCENARIO: "Temperature Monitor"\nGOAL: Auto\n  GET \'temp_sensor_1\'\n  ASSERT > 20\n  WAIT 1000ms'
    }
  ]
};

export function mockFetch(url, options) {
  if (!MOCK_ENABLED) return fetch(url, options);

  // Auth mock
  if (url.includes('/auth/login')) {
    const body = options.body ? JSON.parse(options.body) : {};
    const email = body.email;

    // Special handling for test users
    if (email === 'test@test.com' || email === 'demo@oqlos.io') {
      const user = TEST_USERS[email];
      return fakeResponse({
        message: "Test login successful - redirecting...",
        testMode: true,
        user: user
      });
    }

    // Demo user from .env - email-only login
    if (email === (import.meta.env.VITE_DEMO_USER_EMAIL || 'demo@oqlos.com')) {
      const user = TEST_USERS[email];
      return fakeResponse({
        message: "Demo login successful",
        testMode: true,
        user: user
      });
    }

    return fakeResponse({ message: "Check your email for a login link!" });
  }
  if (url.includes('/auth/verify')) {
    return fakeResponse({
      token: "mock-jwt-token",
      user: TEST_USERS['test@test.com'],
    });
  }

  // User data mock
  if (url.includes('/api/user') || url.includes('/auth/me')) {
    return fakeResponse({
      user: TEST_USERS['test@test.com']
    });
  }

  // Scenarios mock
  if (url.includes('/api/scenarios')) {
    return fakeResponse({
      scenarios: TEST_SCENARIOS[1] || []
    });
  }

  // Billing mock
  if (url.includes('/billing/subscribe')) {
    return fakeResponse({
      checkout_url: null,
      message: "Mock billing — no payment required in dev mode",
    });
  }

  // Subscription status mock
  if (url.includes('/billing/subscription')) {
    return fakeResponse({
      plan: 'pro',
      status: 'active',
      cancel_at_period_end: false
    });
  }

  // NLP mock
  if (url.includes('/nlp/to-oql')) {
    return fakeResponse({
      oql: 'SCENARIO: "NLP Generated"\nGOAL: Auto\n  SET \'pompa 1\' \'2 l/min\'\n  WAIT 2000ms',
      valid: true, issues: [],
    }, 800);
  }
  if (url.includes('/nlp/to-iql')) {
    return fakeResponse({
      iql: 'API GET "${api_url}/api/v1/hardware/health"\nASSERT_STATUS 200',
      valid: true, issues: [],
    }, 600);
  }

  return fetch(url, options);
}

function fakeResponse(data, delay = 200) {
  return new Promise(resolve =>
    setTimeout(() => resolve({
      ok: true, status: 200,
      json: () => Promise.resolve(data),
    }), delay)
  );
}
