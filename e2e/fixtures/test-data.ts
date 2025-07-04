export interface ITestUser {
  email: string;
  password: string;
  name: string;
}

export interface ITestOffer {
  clientName: string;
  description: string;
  price: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

export interface ITestTask {
  title: string;
  description: string;
  type: 'glass' | 'wood' | 'assembly' | 'cardboard' | 'pass';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ITestClient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ITestTeamMember {
  name: string;
  email: string;
  role: string;
}

export class TestDataFactory {
  static createTestUser(): ITestUser {
    return {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User'
    };
  }

  static createTestOffer(): ITestOffer {
    return {
      clientName: `Client ${Date.now()}`,
      description: 'Test frame offer for artwork',
      price: 150.0,
      status: 'draft'
    };
  }

  static createTestTask(): ITestTask {
    return {
      title: `Task ${Date.now()}`,
      description: 'Test task description',
      type: 'glass',
      status: 'pending'
    };
  }

  static createTestClient(): ITestClient {
    return {
      name: `Client ${Date.now()}`,
      email: `client-${Date.now()}@example.com`,
      phone: '+1234567890',
      address: '123 Test Street, Test City, TC 12345'
    };
  }

  static createTestTeamMember(): ITestTeamMember {
    return {
      name: `Team Member ${Date.now()}`,
      email: `member-${Date.now()}@example.com`,
      role: 'Framer'
    };
  }

  static getValidCredentials(): ITestUser {
    return {
      email: 'test@test.com',
      password: 'testPassword123!',
      name: 'Test User'
    };
  }

  // This method will be used by tests that need to get credentials
  // from the test environment setup
  static getTestEnvironmentCredentials(): ITestUser {
    return {
      email: 'test@test.com',
      password: 'testPassword123!',
      name: 'Test User'
    };
  }

  static getInvalidCredentials(): ITestUser {
    return {
      email: 'invalid@example.com',
      password: 'wrongpassword',
      name: 'Invalid User'
    };
  }
}
