import { expect, test } from "@playwright/test";
import { TaskPage } from "../../pages/TaskPage";
import { uniqueTitle } from "../../utils/test-data";

// Jira Test coverage (Story EPMCDMETST-66641): EPMCDMETST-67179

test.describe("Save edited task title UI", () => {
  test.beforeEach(async ({ page }) => {
    const taskPage = new TaskPage(page);
    await taskPage.goto();
  });

  test("saving an edited title updates it in place without a full page reload and preserves list order [EPMCDMETST-67179]", async ({
    page,
  }) => {
    const taskPage = new TaskPage(page);
    const firstTitle = uniqueTitle("Save-First");
    const secondTitle = uniqueTitle("Save-Second");

    await taskPage.addTask(firstTitle);
    await taskPage.addTask(secondTitle);

    const navigationCountBefore = await taskPage.navigationCount();

    const updatedTitle = uniqueTitle("Save-First-Updated");
    await taskPage.enterEditMode(firstTitle);
    await taskPage.editInput().fill(updatedTitle);
    await taskPage.saveEdit();

    await expect(taskPage.taskItem(updatedTitle)).toBeVisible();
    await expect(taskPage.editInput()).toHaveCount(0);
    expect(await taskPage.navigationCount()).toBe(navigationCountBefore);

    // The suite runs against a shared dev database, so assert relative order
    // between these two tasks rather than the full list contents.
    const titles = await taskPage.taskTitles();
    const secondIndex = titles.indexOf(secondTitle);
    const updatedIndex = titles.indexOf(updatedTitle);
    expect(secondIndex).toBeGreaterThanOrEqual(0);
    expect(updatedIndex).toBeGreaterThan(secondIndex);
  });

  test("clicking Cancel discards edits and does not update the task [EPMCDMETST-67179]", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueTitle("Save-Cancel");
    await taskPage.addTask(title);

    let patchRequested = false;
    await page.route("**/api/tasks/**", async (route) => {
      if (route.request().method() === "PATCH") {
        patchRequested = true;
      }
      await route.continue();
    });

    await taskPage.enterEditMode(title);
    await taskPage.editInput().fill(uniqueTitle("Should-Not-Save"));
    await taskPage.cancelEdit();

    await expect(taskPage.editInput()).toHaveCount(0);
    await expect(taskPage.taskItem(title)).toBeVisible();
    expect(patchRequested).toBe(false);
  });
});
