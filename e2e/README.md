# E2E Testing Setup

This directory contains the End-to-End (E2E) tests for the Cadrart frontend application using Playwright.

## Architecture

The E2E tests follow the **Page Object Model (POM)** pattern for maintainability:

- **`pages/`** - Page objects that encapsulate page-specific logic and selectors
- **`fixtures/`** - Test data factories and interfaces
- **`specs/`** - Test specifications organized by feature
- **`utils/`** - Helper utilities for common testing operations
- **`screenshots/`** - Screenshots taken during test failures

## Page Objects

### BasePage
The foundation class that all page objects extend. Provides common methods for:
- Navigation
- Element interactions
- Waiting for elements
- Form interactions

### Feature-specific Pages
- **LoginPage** - Authentication functionality
- **OfferPage** - Offer management
- **TasksPage** - Task management
- **SettingsPage** - Application settings

## Test Data

The `TestDataFactory` class provides methods to create test data:
- `createTestUser()` - Generate test user data
- `createTestOffer()` - Generate test offer data
- `createTestTask()` - Generate test task data
- `getValidCredentials()` - Get valid login credentials
- `getInvalidCredentials()` - Get invalid login credentials

## Running Tests

### Basic Commands
```bash
# Run all E2E tests
npm run e2e

# Run with UI for debugging
npm run e2e:ui

# Run in headed mode (visible browser)
npm run e2e:headed

# Run with debug mode
npm run e2e:debug

# Show test report
npm run e2e:report
```

### Running Specific Tests
```bash
# Run specific test file
npx playwright test auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in specific browser
npx playwright test --project=chromium
```

## Test Structure

Each test file follows this pattern:
```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TestDataFactory } from '../fixtures/test-data';

test.describe('Feature Name', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something', async () => {
    // Test implementation
  });
});
```

## Data Test IDs

To make tests more maintainable, add `data-testid` attributes to your components:

```html
<input 
  data-testid="email-input"
  type="email" 
  [formControl]="emailControl"
/>
```

## Best Practices

1. **Use data-testid attributes** instead of CSS selectors
2. **Keep tests independent** - each test should set up its own data
3. **Use descriptive test names** that explain the business scenario
4. **Implement proper cleanup** to avoid test data pollution
5. **Group related tests** using `test.describe()`
6. **Use page objects** to encapsulate page-specific logic
7. **Use test data factories** for consistent test data

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root. It includes:
- Test directory: `./e2e`
- Base URL: `http://localhost:4200`
- Browser configurations (Chrome, Firefox, Safari)
- Web server setup for development
- Screenshot and video capture on failure

## Troubleshooting

### Common Issues

1. **Tests fail with "element not found"**
   - Ensure the element has a `data-testid` attribute
   - Check if the element is visible and not hidden
   - Verify the page has loaded completely

2. **Tests are flaky**
   - Add proper wait conditions
   - Use `waitForPageLoad()` after navigation
   - Check for race conditions

3. **Authentication issues**
   - Verify test credentials in `TestDataFactory`
   - Check if the backend is running
   - Ensure login flow is working correctly

### Debug Mode

Use debug mode to step through tests:
```bash
npm run e2e:debug
```

This will open the Playwright Inspector where you can:
- Step through test execution
- Inspect elements
- View network requests
- Take screenshots manually 
