const MOCK_ENABLED = import.meta.env.VITE_FORCE_MOCK_API === 'true' || !import.meta.env.VITE_BACKEND_URL;

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

const MOCK_HANDLERS = {
  '/auth/login': (_url, options) => {
    const body = options.body ? JSON.parse(options.body) : {};
    const email = body.email;
    const demoEmail = import.meta.env.VITE_DEMO_USER_EMAIL || 'demo@oqlos.com';

    if (email === 'test@test.com' || email === 'demo@oqlos.io') {
      return { data: { message: "Test login successful - redirecting...", testMode: true, user: TEST_USERS[email] } };
    }
    if (email === demoEmail) {
      return { data: { message: "Demo login successful", testMode: true, user: TEST_USERS[email] } };
    }
    return { data: { message: "Check your email for a login link!" } };
  },
  '/auth/verify': () => ({
    data: { token: "mock-jwt-token", user: TEST_USERS['test@test.com'] },
  }),
  '/api/user': () => ({
    data: { user: TEST_USERS['test@test.com'] },
  }),
  '/auth/me': () => ({
    data: { user: TEST_USERS['test@test.com'] },
  }),
  '/api/scenarios': () => ({
    data: { scenarios: TEST_SCENARIOS[1] || [] },
  }),
  '/billing/subscribe': () => ({
    data: { checkout_url: null, message: "Mock billing — no payment required in dev mode" },
  }),
  '/billing/subscription': () => ({
    data: { plan: 'pro', status: 'active', cancel_at_period_end: false },
  }),
  '/nlp/to-oql': () => ({
    data: {
      oql: 'SCENARIO: "NLP Generated"\nGOAL: Auto\n  SET \'pompa 1\' \'2 l/min\'\n  WAIT 2000ms',
      valid: true, issues: [],
    },
    delay: 800,
  }),
  '/nlp/to-iql': () => ({
    data: {
      iql: 'API GET "${api_url}/api/v1/hardware/health"\nASSERT_STATUS 200',
      valid: true, issues: [],
    },
    delay: 600,
  }),
};

export function mockFetch(url, options) {
  if (!MOCK_ENABLED) return fetch(url, options);

  const match = Object.entries(MOCK_HANDLERS)
    .find(([pattern]) => url.includes(pattern));

  if (match) {
    const [, handler] = match;
    const { data, delay } = handler(url, options);
    return fakeResponse(data, delay);
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
