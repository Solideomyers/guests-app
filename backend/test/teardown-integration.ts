/**
 * Integration Tests Teardown
 *
 * This file runs after all integration tests.
 * It cleans up resources and closes connections.
 */

export default async function teardownIntegrationTests() {
  console.log('🧹 Tearing down integration tests...');

  // Add any global cleanup here if needed
  // For example: closing Redis connections, cleaning up files, etc.

  console.log('✅ Integration tests teardown complete');
}
