import { type Locator, type Page } from "@playwright/test";

/** Page Object Model for the TaskLite single-page app. */
export class TaskPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly addButton: Locator;
  readonly taskListItems: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByLabel("Task title");
    this.addButton = page.getByRole("button", { name: "Add Task" });
    this.taskListItems = page.locator("li.task-item");
    this.errorMessage = page.locator(".app__message--error");
    this.successMessage = page.locator(".app__message--success");
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  taskItem(title: string): Locator {
    return this.taskListItems.filter({ hasText: title });
  }

  async addTask(title: string): Promise<void> {
    await this.titleInput.fill(title);
    await this.addButton.click();
  }

  async toggleStatus(title: string): Promise<void> {
    await this.taskItem(title)
      .getByRole("button", { name: /mark (complete|open)/i })
      .click();
  }

  async deleteTask(title: string): Promise<void> {
    await this.taskItem(title).getByRole("button", { name: "Delete" }).click();
  }

  async enterEditMode(title: string): Promise<void> {
    await this.taskItem(title).getByRole("button", { name: "Edit task" }).click();
  }

  editInput(): Locator {
    return this.page.getByRole("textbox", { name: "Edit task title" });
  }
}
