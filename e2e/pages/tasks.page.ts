import { Page } from '@playwright/test';

import { BasePage } from './base.page';

export class TasksPage extends BasePage {
  private readonly taskList = '[data-testid="task-list"]';
  private readonly taskItem = '[data-testid="task-item"]';
  // Note: These elements don't exist in the current implementation

  constructor(page: Page) {
    super(page);
  }

  async navigateToTasks(): Promise<void> {
    await this.navigateTo('/tasks');
    await this.waitForPageLoad();
  }

  // Note: These methods are not implemented as the UI elements don't exist

  async expectTaskListToBeVisible(): Promise<void> {
    await this.expectElementToBeVisible(this.taskList);
  }

  async getTaskCount(): Promise<number> {
    const tasks = await this.page.locator(this.taskItem).count();
    return tasks;
  }

  async clickTaskByIndex(index: number): Promise<void> {
    const tasks = await this.page.locator(this.taskItem);
    await tasks.nth(index).click();
  }

  async expectTaskToExist(taskTitle: string): Promise<void> {
    const tasks = await this.page.locator(this.taskItem);
    const count = await tasks.count();

    for (let i = 0; i < count; i++) {
      const text = await tasks.nth(i).textContent();
      if (text?.includes(taskTitle)) {
        return;
      }
    }

    throw new Error(`Task with title "${taskTitle}" not found`);
  }

  async navigateToTaskType(type: string): Promise<void> {
    await this.navigateTo(`/tasks/${type}`);
    await this.waitForPageLoad();
  }
}
