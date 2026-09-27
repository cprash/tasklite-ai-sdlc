import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

const app = createApp();

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("PATCH /api/tasks/:id (update title) [EPMCDMETST-66640]", () => {
  it("updates and persists the title when given a non-empty title (200)", async () => {
    const created = await prisma.task.create({ data: { title: "Original" } });

    const res = await request(app).patch(`/api/tasks/${created.id}`).send({ title: "Updated title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated title");

    const persisted = await prisma.task.findUnique({ where: { id: created.id } });
    expect(persisted?.title).toBe("Updated title");
  });

  it("trims surrounding whitespace before persisting", async () => {
    const created = await prisma.task.create({ data: { title: "Original" } });

    const res = await request(app).patch(`/api/tasks/${created.id}`).send({ title: "  Trimmed  " });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Trimmed");
  });

  it("returns 404 when the task does not exist", async () => {
    const res = await request(app).patch("/api/tasks/999999").send({ title: "Does not matter" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Task not found" });
  });

  it("returns 404 when the id is not an integer", async () => {
    const res = await request(app).patch("/api/tasks/not-a-number").send({ title: "Does not matter" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Task not found" });
  });

  it("returns 400 and does not update when the title is empty", async () => {
    const created = await prisma.task.create({ data: { title: "Keep me" } });

    const res = await request(app).patch(`/api/tasks/${created.id}`).send({ title: "" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "title is required" });

    const persisted = await prisma.task.findUnique({ where: { id: created.id } });
    expect(persisted?.title).toBe("Keep me");
  });

  it("returns 400 and does not update when the title is whitespace-only", async () => {
    const created = await prisma.task.create({ data: { title: "Keep me" } });

    const res = await request(app).patch(`/api/tasks/${created.id}`).send({ title: "    " });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "title is required" });

    const persisted = await prisma.task.findUnique({ where: { id: created.id } });
    expect(persisted?.title).toBe("Keep me");
  });
});
