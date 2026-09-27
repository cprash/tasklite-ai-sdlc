// Automation coverage: EPMCDMETST-66824 (AC1, AC2), EPMCDMETST-66825 (AC3)
// Parent Story: EPMCDMETST-66637

import { expect, test } from "@playwright/test";
import { TaskPage } from "../../pages/TaskPage";
import { uniqueTitle } from "../../utils/test-data";

test.describe("Task edit mode UI", () => {
  test.beforeEach(async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
  });

  test("clicking Edit switches the task into edit mode with the title prefilled and focused", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueTitle("UI-Edit");

    await taskPage.addTask(title);
    await expect(taskPage.taskItem(title)).toBeVisible();

    await taskPage.enterEditMode(title);

    const editInput = taskPage.editInput();
    await expect(editInput).toBeFocused();
    await expect(editInput).toHaveValue(title);
  });

  test("only one task can be in edit mode at a time", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const firstTitle = uniqueTitle("UI-Edit-First");
    const secondTitle = uniqueTitle("UI-Edit-Second");

    await taskPage.addTask(firstTitle);
    await taskPage.addTask(secondTitle);

    await taskPage.enterEditMode(firstTitle);
    await expect(taskPage.editInput()).toHaveCount(1);
    await expect(taskPage.editInput()).toHaveValue(firstTitle);

    await taskPage.enterEditMode(secondTitle);
    await expect(taskPage.editInput()).toHaveCount(1);
    await expect(taskPage.editInput()).toHaveValue(secondTitle);
  });
});
