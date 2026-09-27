import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// App is an integration point for TaskList/TaskItem.

describe("EPMCDMETST-66637 – enter edit mode from task list", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mock("../../services/taskApi", () => ({
      fetchTasks: vi.fn(),
      createTask: vi.fn().mockResolvedValue(undefined),
      updateTaskStatus: vi.fn().mockResolvedValue(undefined),
      deleteTask: vi.fn().mockResolvedValue(undefined),
    }));
  });

  afterEach(() => {
    vi.clearuAllMocks();
  });

  it("AC1: clicking Edit switches a task to edit mode with prefilled title", async () => {
    const tasks = [
      {
        id: 1,
        title: "First task",
        status: "OPEN",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];

    const { fetchTasks } = await import("../../services/taskApi");
    (fetchTasks as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(tasks);

    const { default: App } = await import("../../App");
    const user = userEvent.setup();
    render(<App />);

    const editBtn = await screen.findByRole("button", { name: /edit task/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    expect(input).toHaveValue("First task");
  });

  it("AC2: entering edit mode auto-focuses the text input", async () => {
    const tasks = [
      {
        id: 1,
        title: "First task",
        status: "OPEN",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];

    const { fetchTasks } = await import("../../services/taskApi");
    (fetchTasks as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(tasks);

    const { default: App } = await import("../../App");
    const user = userEvent.setup();
    render(<App />);

    const editBtn = await screen.findByRole("button", { name: /edit task/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    expect(input).toHaveFocus();
  });

  it("AC3: only one task can be in edit mode at a time", async () => {
    const tasks = [
      {
        id: 1,
        title: "First task",
        status: "OPEN",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      {
        id: 2,
        title: "Second task",
        status: "OPEN",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];

    const { fetchTasks } = await import("../../services/taskApi");
    (fetchTasks as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(tasks);

    const { default: App } = await import("../../App");
    const user = userEvent.setup();
    render(<App />);

    const editBtns = await screen.findAllByRole("button", { name: /edit task/i });

    await user.click(editBtns[0]);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("First task");

    await user.click(editBtns[1]);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("textbox")).toHaveValue("Second task");
  });
});
