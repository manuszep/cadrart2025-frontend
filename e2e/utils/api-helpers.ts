import { APIRequestContext } from '@playwright/test';

import { ITestUser, ITestClient, ITestTeamMember } from '../fixtures/test-data';

export class ApiHelpers {
  constructor(private request: APIRequestContext) {}

  // Database cleanup using test endpoint
  async cleanupDatabase(): Promise<void> {
    // Skip cleanup if E2E_SKIP_CLEANUP is set to 'true'
    if (process.env['E2E_SKIP_CLEANUP'] === 'true') {
      console.log('Skipping database cleanup (E2E_SKIP_CLEANUP=true)');
      return;
    }

    try {
      const response = await this.request.delete('/api/test/cleanup', {
        headers: {
          'x-test-secret': process.env['TEST_ENDPOINT_SECRET'] || 'dev-secret-key'
        }
      });
      if (!response.ok()) {
        console.warn('Cleanup failed:', response.statusText());
      }
    } catch (error) {
      console.warn('Cleanup warning:', error);
      // Continue with test setup even if cleanup fails
    }
  }

  // Create test team member (user)
  async createTestTeamMember(teamMember: ITestTeamMember): Promise<{ id: number; user: ITestTeamMember }> {
    const response = await this.request.post('/api/team-member', {
      data: {
        firstName: teamMember.name.split(' ')[0],
        lastName: teamMember.name.split(' ')[1] || '',
        mail: teamMember.email,
        password: 'testPassword123!', // Will be hashed by backend
        role: teamMember.role,
        image: 'default'
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test team member: ${response.statusText()}`);
    }

    const createdUser = await response.json();
    return { id: createdUser.id, user: teamMember };
  }

  // Create test client
  async createTestClient(client: ITestClient): Promise<{ id: number; client: ITestClient }> {
    const response = await this.request.post('/api/client', {
      data: {
        firstName: client.name.split(' ')[0],
        lastName: client.name.split(' ')[1] || '',
        company: client.name,
        address: client.address,
        mail: client.email,
        phone: client.phone,
        phone2: '',
        vat: '',
        reduction: 0
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test client: ${response.statusText()}`);
    }

    const createdClient = await response.json();
    return { id: createdClient.id, client };
  }

  // Create test article
  async createTestArticle(name: string, family: string): Promise<{ id: number; name: string }> {
    const response = await this.request.post('/api/article', {
      data: {
        name,
        family,
        description: `Test article: ${name}`,
        price: 10.0,
        unit: 'piece'
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test article: ${response.statusText()}`);
    }

    const createdArticle = await response.json();
    return { id: createdArticle.id, name };
  }

  // Create test tag
  async createTestTag(name: string, color: string = '#000000'): Promise<{ id: number; name: string }> {
    const response = await this.request.post('/api/tag', {
      data: {
        name,
        color
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test tag: ${response.statusText()}`);
    }

    const createdTag = await response.json();
    return { id: createdTag.id, name };
  }

  // Create test location
  async createTestLocation(name: string): Promise<{ id: number; name: string }> {
    const response = await this.request.post('/api/location', {
      data: {
        name,
        address: `Test address for ${name}`,
        description: `Test location: ${name}`
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test location: ${response.statusText()}`);
    }

    const createdLocation = await response.json();
    return { id: createdLocation.id, name };
  }

  // Create test provider
  async createTestProvider(name: string): Promise<{ id: number; name: string }> {
    const response = await this.request.post('/api/provider', {
      data: {
        name,
        address: `Test address for ${name}`,
        mail: `${name.toLowerCase().replace(' ', '.')}@test-provider.com`,
        phone: '+1234567890',
        description: `Test provider: ${name}`
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test provider: ${response.statusText()}`);
    }

    const createdProvider = await response.json();
    return { id: createdProvider.id, name };
  }

  // Create test formula
  async createTestFormula(name: string): Promise<{ id: number; name: string }> {
    const response = await this.request.post('/api/formula', {
      data: {
        name,
        description: `Test formula: ${name}`,
        formula: 'base_price * 1.2',
        isActive: true
      }
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test formula: ${response.statusText()}`);
    }

    const createdFormula = await response.json();
    return { id: createdFormula.id, name };
  }

  // Setup complete test environment using test endpoint
  async setupTestEnvironment(): Promise<{
    testUser: ITestUser;
    testClients: Array<{
      id: number;
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      tag?: string;
    }>;
    testArticles: Array<{
      id: number;
      name: string;
      family: number;
      sellPrice: number;
      provider?: string;
    }>;
    testTags: Array<{ id: number; name: string }>;
    testLocations: Array<{ id: number; name: string }>;
    testProviders: Array<{
      id: number;
      name: string;
      mail?: string;
    }>;
    testFormulas: Array<{
      id: number;
      name: string;
      formula: string;
    }>;
  }> {
    // Clean database first (unless E2E_SKIP_CLEANUP is set)
    await this.cleanupDatabase();

    // Setup test data using the test endpoint
    const response = await this.request.post('/api/test/setup', {
      headers: {
        'x-test-secret': process.env['TEST_ENDPOINT_SECRET'] || 'dev-secret-key'
      }
    });
    if (!response.ok()) {
      throw new Error(`Failed to setup test environment: ${response.statusText()}`);
    }

    const result = await response.json();
    const { data } = result;

    return {
      testUser: data.testUser,
      testClients: data.testClients,
      testArticles: data.testArticles,
      testTags: data.testTags,
      testLocations: data.testLocations,
      testProviders: data.testProviders,
      testFormulas: data.testFormulas
    };
  }

  // Cleanup test environment
  async cleanupTestEnvironment(): Promise<void> {
    await this.cleanupDatabase();
  }
}
