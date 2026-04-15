const MOCK_ENABLED = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL;

export function mockFetch(url, options) {
  if (!MOCK_ENABLED) return fetch(url, options);

  // Auth mock
  if (url.includes('/auth/login')) {
    return fakeResponse({ message: "Check your email for a login link!" });
  }
  if (url.includes('/auth/verify')) {
    return fakeResponse({
      token: "mock-jwt-token",
      user: { email: "demo@oqlos.io", role: "admin" },
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

  // Billing mock
  if (url.includes('/billing/subscribe')) {
    return fakeResponse({
      checkout_url: null,
      message: "Mock billing — no payment required in dev mode",
    });
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
