import { expect, test } from "@playwright/test";
import { TasksApiClient } from "../../api-clients/tasks.client";
import { uniqueTitle } from "../../utils/test-data";

// Jira Test coverage (Story EPMCDMETST-66640, PATCH /api/tasks/:id):
// EPMCDMETST-66837, EPMCDMETST-66838, EPMCDMETST-66839, EPMCDMETST-66840, EPMCDMETST-66841
// Also satisfies EPMCDMETST-67180 (Story EPMCDMETST-66641 API coverage for the same
// PATCH /api/tasks/:id contract: title update and empty/whitespace-title validation).

test.describe("Task title update API (PATCH /api/tasks/:id)", () => {
  let api: TasksApiClient;

  test.beforeEach(({ request }) => {
    api = new TasksApiClient(request);
  });

  // EPMCDMETST-66837
  test("updates and persists a task title [EPMCDMETST-66837]", async () => {
    const created = await (await api.create({ title: uniqueTitle("Title-Original") })).json();
    const newTitle = uniqueTitle("Title-Updated");

    const response = await api.updateTitle(created.id, { title: newTitle });
    expect(response.status()).toBe(200);

    const updated = await response.json();
    expect(updated).toMatchObject({ id: created.id, title: newTitle });

    // Persistence check via a fresh read.
    const tasks: Array<{ id: number; title: string }> = await (await api.list()).json();
    expect(tasks.find((task) => task.id === created.id)?.title).toBe(newTitle);

    await api.remove(created.id);
  });

  // EPMCDMETST-66838
  test("trims surrounding whitespace from the new title [EPMCDMETST-66838]", async () => {
    const created = await (await api.create({ title: uniqueTitle("Title-Trim") })).json();
    const core = uniqueTitle("Trimmed");

    const response = await api.updateTitle(created.id, { title: `   ${core}   ` });
    expect(response.status()).toBe(200);
    expect((await response.json()).title).toBe(core);

    const tasks: Array<{ id: number; title: string }> = await (await api.list()).json();
    expect(tasks.find((task) => task.id === created.id)?.title).toBe(core);

    await api.remove(created.id);
  });

  // EPMCDMETST-66839
  test("rejects an empty or whitespace-only title with 400 and does not update [EPMCDMETST-66839]", async () => {
    const original = uniqueTitle("Title-Keep");
    const created = await (await api.create({ title: original })).json();

    for (const badTitle of ["", "   "]) {
      const response = await api.updateTitle(created.id, { title: badTitle });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.error).toBeTruthy();
    }

    // Title must be unchanged after the rejected updates.
    const tasks: Array<{ id: number; title: string }> = await (await api.list()).json();
    expect(tasks.find((task) => task.id === created.id)?.title).toBe(original);

    await api.remove(created.id);
  });

  // EPMCDMETST-66840
  test("returns 404 when updating the title of a non-existent task [EPMCDMETST-66840]", async () => {
    const response = await api.updateTitle(999_999_999, { title: uniqueTitle("Ghost") });
    expect(response.status()).toBe(404);
  });

  // EPMCDMETST-66841
  test("returns 404 when the id is not an integer [EPMCDMETST-66841]", async () => {
    const response = await api.updateTitle("not-an-integer", { title: uniqueTitle("BadId") });
    expect(response.status()).toBe(404);
  });
});
