import { test } from '@playwright/test';

import { TasksPage } from '../pages/tasks.page';

test.describe('Tasks', () => {
  let tasksPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
  });

  test('should navigate to tasks page', async () => {
    await tasksPage.navigateToTasks();
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

  test('should navigate to specific task types', async () => {
    await tasksPage.navigateToTaskType('glass');
    await tasksPage.expectTaskListToBeVisible();
  });
});
