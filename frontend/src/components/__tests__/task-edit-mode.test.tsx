import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { fetchTasks } from "../../services/taskApi";
import type { Task } from "../../types/task";

// vi.mock is hoisted to the top of the module, so it must live at top-level scope.
vi.mock("../../services/taskApi", () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn().mockResolvedValue(undefined),
  updateTaskStatus: vi.fn().mockResolvedValue(undefined),
  deleteTask: vi.fn().mockResolvedValue(undefined),
}));

const mockedFetchTasks = vi.mocked(fetchTasks);

afterEach(() => {
  vi.clearAllMocks();
});

describe("EPMCDMETST-66637 – enter edit mode from task list", () => {
  const oneTask: Task[] = [
    {
      id: 1,
      title: "First task",
      status: "OPEN",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ];

  const twoTasks: Task[] = [
    ...oneTask,
    {
      id: 2,
      title: "Second task",
      status: "OPEN",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ];

  it("AC1: clicking Edit switches a task to edit mode with prefilled title", async () => {
    mockedFetchTasks.mockResolvedValue(oneTask);
    const user = userEvent.setup();
    render(<App />);

    const editBtn = await screen.findByRole("button", { name: /edit task/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    expect(input).toHaveValue("First task");
  });

  it("AC2: entering edit mode auto-focuses the text input", async () => {
    mockedFetchTasks.mockResolvedValue(oneTask);
    const user = userEvent.setup();
    render(<App />);

    const editBtn = await screen.findByRole("button", { name: /edit task/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    expect(input).toHaveFocus();
  });

  it("AC2b: entering edit mode selects the current title text", async () => {
    mockedFetchTasks.mockResolvedValue(oneTask);
    const user = userEvent.setup();
    render(<App />);

    const editBtn = await screen.findByRole("button", { name: /edit task/i });
    await user.click(editBtn);

    const input = screen.getByRole("textbox", { name: /edit task title/i }) as HTMLInputElement;
    // select() sets the selection range to cover the whole value.
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
    expect(input.value.length).toBeGreaterThan(0);
  });

  it("AC3: only one task can be in edit mode at a time", async () => {
    mockedFetchTasks.mockResolvedValue(twoTasks);
    const user = userEvent.setup();
    render(<App />);

    const editBtns = await screen.findAllByRole("button", { name: /edit task/i });

    await user.click(editBtns[0]);
    expect(screen.getAllByRole("textbox", { name: /edit task title/i })).toHaveLength(1);
    expect(screen.getByRole("textbox", { name: /edit task title/i })).toHaveValue("First task");

    await user.click(editBtns[1]);
    expect(screen.getAllByRole("textbox", { name: /edit task title/i })).toHaveLength(1);
    expect(screen.getByRole("textbox", { name: /edit task title/i })).toHaveValue("Second task");
  });
});
