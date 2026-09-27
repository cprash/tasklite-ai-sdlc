import { expect, test } from "@playwright/test";
import { TasksApiClient } from "../../api-clients/tasks.client";
import { uniqueTitle } from "../../utils/test-data";

test.describe("Tasks API", () => {
  let api: TasksApiClient;

  test.beforeEach(({ request }) => {
    api = new TasksApiClient(request);
  });

  test("creates a task with a valid title", async () => {
    const title = uniqueTitle("Create");
    const response = await api.create({ title });

    expect(response.status()).toBe(201);
    const task = await response.json();
    expect(task).toMatchObject({ title, status: "OPEN" });
    expect(typeof task.id).toBe("number");

    await api.remove(task.id);
  });

  test("rejects creating a task with a blank title", async () => {
    const response = await api.create({ title: "   " });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test("lists tasks newest first", async () => {
    const first = await (await api.create({ title: uniqueTitle("List-First") })).json();
    const second = await (await api.create({ title: uniqueTitle("List-Second") })).json();

    const response = await api.list();
    expect(response.ok()).toBeTruthy();
    const tasks: Array<{ id: number }> = await response.json();

    const firstIndex = tasks.findIndex((task) => task.id === first.id);
    const secondIndex = tasks.findIndex((task) => task.id === second.id);
    expect(secondIndex).toBeLessThan(firstIndex);

    await api.remove(first.id);
    await api.remove(second.id);
  });

  test("updates a task status to COMPLETED and back to OPEN", async () => {
    const created = await (await api.create({ title: uniqueTitle("Status") })).json();

    const completedResponse = await api.updateStatus(created.id, { status: "COMPLETED" });
    expect(completedResponse.status()).toBe(200);
    expect((await completedResponse.json()).status).toBe("COMPLETED");

    const reopenedResponse = await api.updateStatus(created.id, { status: "OPEN" });
    expect((await reopenedResponse.json()).status).toBe("OPEN");

    await api.remove(created.id);
  });

  test("rejects an invalid status value", async () => {
    const created = await (await api.create({ title: uniqueTitle("Invalid-Status") })).json();

    const response = await api.updateStatus(created.id, { status: "DONE" });
    expect(response.status()).toBe(400);

    await api.remove(created.id);
  });

  test("returns 404 when updating status of a non-existent task", async () => {
    const response = await api.updateStatus(999_999_999, { status: "OPEN" });
    expect(response.status()).toBe(404);
  });

  test("deletes a task", async () => {
    const created = await (await api.create({ title: uniqueTitle("Delete") })).json();

    const deleteResponse = await api.remove(created.id);
    expect(deleteResponse.status()).toBe(204);

    const tasks: Array<{ id: number }> = await (await api.list()).json();
    expect(tasks.find((task) => task.id === created.id)).toBeUndefined();
  });

  test("returns 404 when deleting a non-existent task", async () => {
    const response = await api.remove(999_999_999);
    expect(response.status()).toBe(404);
  });
});
