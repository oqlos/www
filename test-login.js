#!/usr/bin/env node

/**
 * Test script to debug login flow
 * Simulates what happens when you try to login
 */

// Load environment variables
const DEMO_EMAIL = process.env.VITE_DEMO_USER_EMAIL || 'demo@oqlos.com';

console.log('=== Login Debug Test ===');
console.log('Demo email:', DEMO_EMAIL);
console.log('');

// Test 1: Check if MOCK_ENABLED would be true
const VITE_BACKEND_URL = process.env.VITE_BACKEND_URL;
const MOCK_ENABLED = !VITE_BACKEND_URL;
console.log('VITE_BACKEND_URL:', VITE_BACKEND_URL);
console.log('MOCK_ENABLED:', MOCK_ENABLED);
console.log('');

// Test 2: Check if mockFetch would intercept
console.log('Test: Would mockFetch intercept /auth/login?');
console.log('URL: /auth/login');
console.log('MOCK_ENABLED:', MOCK_ENABLED);
console.log('Would intercept:', MOCK_ENABLED ? 'YES' : 'NO');
console.log('');

if (!MOCK_ENABLED) {
  console.log('ERROR: MOCK_ENABLED is false!');
  console.log('This means mockFetch will NOT intercept requests.');
  console.log('The requests will go to real backend at:', VITE_BACKEND_URL || 'http://localhost:8101');
  console.log('');
  console.log('FIX: Unset VITE_BACKEND_URL environment variable');
} else {
  console.log('SUCCESS: MOCK_ENABLED is true');
  console.log('mockFetch will intercept /auth/login requests');
  console.log('Demo user should be able to login with email:', DEMO_EMAIL);
}
