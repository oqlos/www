// Global mock switch (legacy mode - mocks everything)
const FORCE_MOCK_ALL = import.meta.env.VITE_FORCE_MOCK_API === 'true';

// Individual mock controls (selective mocking)
const MOCK_CONFIG = {
  auth: import.meta.env.VITE_MOCK_AUTH === 'true' || (FORCE_MOCK_ALL && import.meta.env.VITE_MOCK_AUTH !== 'false'),
  userApi: import.meta.env.VITE_MOCK_USER_API === 'true' || (FORCE_MOCK_ALL && import.meta.env.VITE_MOCK_USER_API !== 'false'),
  scenarios: import.meta.env.VITE_MOCK_SCENARIOS === 'true' || (FORCE_MOCK_ALL && import.meta.env.VITE_MOCK_SCENARIOS !== 'false'),
  billing: import.meta.env.VITE_MOCK_BILLING === 'true' || (FORCE_MOCK_ALL && import.meta.env.VITE_MOCK_BILLING !== 'false'),
  nlp: import.meta.env.VITE_MOCK_NLP === 'true' || (FORCE_MOCK_ALL && import.meta.env.VITE_MOCK_NLP !== 'false'),
};

// Any mocking enabled?
const MOCK_ENABLED = FORCE_MOCK_ALL || Object.values(MOCK_CONFIG).some(v => v);

// Export mock status for status page
export const MOCK_STATUS = {
  globalEnabled: MOCK_ENABLED,
  forceMockAll: FORCE_MOCK_ALL,
  backendUrl: import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || null,
  endpoints: {
    auth: { mocked: MOCK_CONFIG.auth, path: '/auth/*', description: 'Authentication (login, verify)' },
    userApi: { mocked: MOCK_CONFIG.userApi, path: '/api/user*', description: 'User API' },
    scenarios: { mocked: MOCK_CONFIG.scenarios, path: '/api/scenarios', description: 'Scenarios API' },
    billing: { mocked: MOCK_CONFIG.billing, path: '/billing/*', description: 'Billing & Subscription' },
    nlp: { mocked: MOCK_CONFIG.nlp, path: '/nlp/*', description: 'NLP/LLM API' },
  }
};

const DEMO_USER = {
  email: import.meta.env.VITE_DEMO_USER_EMAIL || 'demo@oqlos.com',
  name: import.meta.env.VITE_DEMO_USER_NAME || 'Demo User',
  role: import.meta.env.VITE_DEMO_USER_ROLE || 'user',
};

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
  [DEMO_USER.email]: {
    id: 3,
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    role: DEMO_USER.role,
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

function parseMockRequestBody(options) {
  if (!options?.body) return {};
  try {
    return JSON.parse(options.body);
  } catch {
    return {};
  }
}

function createMockLoginData(options) {
  const email = String(parseMockRequestBody(options).email || '');
  const user = TEST_USERS[email];

  if (!user) {
    return { message: "Check your email for a login link!" };
  }

  return {
    message: email === DEMO_USER.email ? "Demo login successful" : "Test login successful - redirecting...",
    testMode: true,
    user,
  };
}

const MOCK_HANDLERS = {
  // Auth endpoints
  ...(MOCK_CONFIG.auth && {
    '/auth/login': (_url, options) => ({ data: createMockLoginData(options) }),
    '/auth/verify': () => ({
      data: { token: "mock-jwt-token", user: TEST_USERS['test@test.com'] },
    }),
    '/auth/me': () => ({
      data: { user: TEST_USERS['test@test.com'] },
    }),
  }),
  // User API endpoints
  ...(MOCK_CONFIG.userApi && {
    '/api/user': () => ({
      data: { user: TEST_USERS['test@test.com'] },
    }),
  }),
  // Scenarios endpoints
  ...(MOCK_CONFIG.scenarios && {
    '/api/scenarios': () => ({
      data: { scenarios: TEST_SCENARIOS[1] || [] },
    }),
  }),
  // Billing endpoints
  ...(MOCK_CONFIG.billing && {
    '/billing/subscribe': (url, options) => {
      const plan = url.match(/\/subscribe\/(\w+)/)?.[1] || 'pro';
      return {
        data: {
          checkout_url: `${window.location.origin}/billing?session=mock_${plan}_session_${Date.now()}`,
          message: "Mock billing — redirecting to checkout (dev mode)"
        },
      };
    },
    '/billing/subscription': () => ({
      data: { plan: 'pro', status: 'active', cancel_at_period_end: false },
    }),
    '/billing/subscription/cancel': () => ({
      data: { success: true, message: "Subscription cancelled (mock)" },
    }),
    '/billing/subscription/reactivate': () => ({
      data: { success: true, message: "Subscription reactivated (mock)" },
    }),
  }),
  // NLP endpoints (only if explicitly enabled)
  ...(MOCK_CONFIG.nlp && {
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
  }),
};

export function mockFetch(url, options) {
  if (!MOCK_ENABLED) return fetch(url, options);

  const match = Object.entries(MOCK_HANDLERS)
    .find(([pattern]) => url.includes(pattern));

  if (match) {
    const [, handler] = match;
    const { data, delay } = handler(url, options);
    console.log(`[MOCK] ${url} → mocked response`);
    return fakeResponse(data, delay);
  }

  // No mock handler - use real fetch
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
