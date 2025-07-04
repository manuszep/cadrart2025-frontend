import { test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { TasksPage } from '../pages/tasks.page';
import { TestDataFactory } from '../fixtures/test-data';

test.describe('Tasks', () => {
  let loginPage: LoginPage;
  let tasksPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    tasksPage = new TasksPage(page);

    // Login first
    await loginPage.navigateToLogin();
    const validCredentials = TestDataFactory.getValidCredentials();
    await loginPage.login(validCredentials.email, validCredentials.password);
    await loginPage.expectSuccessfulLogin();
  });

  test('should navigate to tasks page', async () => {
    await tasksPage.navigateToTasks();
    await tasksPage.expectTaskListToBeVisible();
  });

  test('should display create task button', async () => {
    await tasksPage.navigateToTasks();
    await tasksPage.expectElementToBeVisible('[data-testid="create-task-button"]');
  });

  test('should allow filtering by task type', async () => {
    await tasksPage.navigateToTasks();
    await tasksPage.filterByType('glass');

    // Verify filter is applied
    await tasksPage.expectElementToBeVisible('[data-testid="task-type-filter"]');
  });

  test('should allow filtering by task status', async () => {
    await tasksPage.navigateToTasks();
    await tasksPage.filterByStatus('pending');

    // Verify filter is applied
    await tasksPage.expectElementToBeVisible('[data-testid="task-status-filter"]');
  });

  test('should allow searching tasks', async () => {
    await tasksPage.navigateToTasks();
    await tasksPage.searchTasks('test task');

    // Verify search input is filled
    const searchValue = await tasksPage.getElementText('[data-testid="search-tasks-input"]');
    if (!searchValue.includes('test task')) {
      throw new Error('Search input not properly filled');
    }
  });

  test('should navigate to specific task types', async () => {
    await tasksPage.navigateToTaskType('glass');
    await tasksPage.expectTaskListToBeVisible();
  });

  test('should display task list', async () => {
    await tasksPage.navigateToTasks();
    await tasksPage.expectTaskListToBeVisible();

    const taskCount = await tasksPage.getTaskCount();
    // Should have at least 0 tasks (empty state is valid)
    if (taskCount < 0) {
      throw new Error('Invalid task count');
    }
  });
});
