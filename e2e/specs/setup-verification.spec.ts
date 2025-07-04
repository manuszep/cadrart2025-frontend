import { test, expect } from '@playwright/test';

import { ApiHelpers } from '../utils/api-helpers';

test.describe('Test Environment Setup Verification', () => {
  test('should setup and cleanup test environment', async ({ request }) => {
    const apiHelpers = new ApiHelpers(request);
    // Setup test environment
    const testEnvironment = await apiHelpers.setupTestEnvironment();

    // Verify test user was created
    expect(testEnvironment.testUser).toBeDefined();
    expect(testEnvironment.testUser.email).toBe('test@test.com');
    expect(testEnvironment.testUser.password).toBe('testPassword123!');

    // Verify test clients were created
    expect(testEnvironment.testClients).toBeDefined();
    expect(testEnvironment.testClients.length).toBeGreaterThan(0);
    expect(testEnvironment.testClients[0].name).toBe("Cadr'Art");

    // Verify test articles were created
    expect(testEnvironment.testArticles).toHaveLength(12);
    expect(testEnvironment.testArticles[0].name).toBe('157 - pl 20 x 20 noir');
    expect(testEnvironment.testArticles[1].name).toBe('919 - decoupe PP bis');
    expect(testEnvironment.testArticles[2].name).toBe('sp70 - verre antireflets / anti UV 70%');

    // Verify test tags were created
    expect(testEnvironment.testTags).toHaveLength(5);
    expect(testEnvironment.testTags[0].name).toBe('Gallerie');
    expect(testEnvironment.testTags[1].name).toBe('Particulier');
    expect(testEnvironment.testTags[2].name).toBe('Société');

    // Verify test locations were created
    expect(testEnvironment.testLocations).toHaveLength(12);
    expect(testEnvironment.testLocations[0].name).toBe('R1');
    expect(testEnvironment.testLocations[1].name).toBe('R2');
    expect(testEnvironment.testLocations[2].name).toBe('Rouleau / ici');

    // Verify test providers were created
    expect(testEnvironment.testProviders).toHaveLength(5);
    expect(testEnvironment.testProviders[0].name).toBe('Cami');
    expect(testEnvironment.testProviders[1].name).toBe('Eurolijsten');
    expect(testEnvironment.testProviders[2].name).toBe('Wybenga');

    // Verify test formulas were created
    expect(testEnvironment.testFormulas).toHaveLength(6);
    expect(testEnvironment.testFormulas[0].name).toBe('Surcout initial');
    expect(testEnvironment.testFormulas[1].name).toBe('Cout initial');
    expect(testEnvironment.testFormulas[2].name).toBe('decoupe verre SP');

    // Cleanup test environment
    await apiHelpers.cleanupTestEnvironment();
  });
});
