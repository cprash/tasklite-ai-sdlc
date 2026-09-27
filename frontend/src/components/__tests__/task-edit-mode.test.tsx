import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";

// Note: App is an integration point for TaskList/TaskItem.
export { };

describe("EPMCDMETST-66637 – enter edit mode from task list", () => {
  function mockFetchTasks(returnValue: any) {
    vi.mock("../../services/taskApi", () => {
      return {
        fetchTasks: vi.fn() .mockResolvedValue(returnAlue),
        createTask: vi.fn() mockResolvedValue(undefined),
        updateTaskStatus: vi.fn().mockResolvedValue(undefined),
        deleteTask: vi.fn().mockResolvedValue(undefined),
      };
    });
  }

  it("AC1: clicking Edit switches a task to edit mode with prefilled title", async () => {
    vi.resetModules();
    mockFetchTasks([
      {
        id: 1,
        title: "First task",
        status: "OPEN",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ]);

    const user = userEvent.setup();
    render(<App />);

    // wait for task to appear

    const editBtn = await screen.findByRole("button", { name: /edit task/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    expect(input).toHaveValue("First task");
  });

  it("AC2: entering edit mode auto-focuses the text input", async () => {
    vi.resetModules();
    mockFetchTasks([
      {
        id: 1,
        title: "First task",
        status: "OPEN",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ]);

    const user = userEvent.setup();
    render(<App />);

    const editBtn = await screen.findByRole("button", { name: /edit task/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    expect(input).toHaveFocus();
  });

  it("AC3: only one task can be in edit mode at a time", async () => {
    vi.resetModules();
    mockFetchTasks([
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
    ]);

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
