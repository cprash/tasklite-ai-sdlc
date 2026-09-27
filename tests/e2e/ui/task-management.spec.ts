import { expect, test } from "@playwright/test";
import { TaskPage } from "../../pages/TaskPage";
import { uniqueTitle } from "../../utils/test-data";

test.describe("Task management UI", () => {
  test.beforeEach(async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
  });

  test("Add Task button is disabled until a title is entered", async ({ page }) => {
    const taskPage = new TaskPage(page);
    await expect(taskPage.addButton).toBeDisabled();

    await taskPage.titleInput.fill("Draft title");
    await expect(taskPage.addButton).toBeEnabled();
  });

  test("adds a new task to the list", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueTitle("UI-Create");

    await taskPage.addTask(title);

    await expect(taskPage.taskItem(title)).toBeVisible();
    await expect(taskPage.successMessage).toHaveText("Task added.");
  });

  test("marks a task complete and back to open", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueTitle("UI-Toggle");

    await taskPage.addTask(title);
    await expect(taskPage.taskItem(title)).toBeVisible();

    await taskPage.toggleStatus(title);
    await expect(taskPage.taskItem(title)).toHaveClass(/task-item--completed/);
    await expect(taskPage.taskItem(title).getByText("Completed")).toBeVisible();

    await taskPage.toggleStatus(title);
    await expect(taskPage.taskItem(title)).not.toHaveClass(/task-item--completed/);
  });

  test("deletes a task from the list", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueTitle("UI-Delete");

    await taskPage.addTask(title);
    await expect(taskPage.taskItem(title)).toBeVisible();

    await taskPage.deleteTask(title);
    await expect(taskPage.taskItem(title)).toHaveCount(0);
    await expect(taskPage.successMessage).toHaveText("Task deleted.");
  });
});
