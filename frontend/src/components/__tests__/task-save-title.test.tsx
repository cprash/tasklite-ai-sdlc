import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { fetchTasks, updateTaskTitle } from "../../services/taskApi";
import type { Task } from "../../types/task";

// vi.mock is hoisted to the top of the module, so it must live at top-level scope.
vi.mock("../../services/taskApi", () => ({
  fetchTasks: vi.fn(),
  createTask: vi.fn().mockResolvedValue(undefined),
  updateTaskStatus: vi.fn().mockResolvedValue(undefined),
  updateTaskTitle: vi.fn(),
  deleteTask: vi.fn().mockResolvedValue(undefined),
}));

const mockedFetchTasks = vi.mocked(fetchTasks);
const mockedUpdateTaskTitle = vi.mocked(updateTaskTitle);

afterEach(() => {
  vi.clearAllMocks();
});

describe("EPMCDMETST-66641 – save edited title without full page reload", () => {
  const twoTasks: Task[] = [
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
      createdAt: "2026-01-02T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    },
  ];

  it("AC: saving calls PATCH via updateTaskTitle with the new title", async () => {
    mockedFetchTasks.mockResolvedValue(twoTasks);
    mockedUpdateTaskTitle.mockResolvedValue({ ...twoTasks[0], title: "Renamed task" });
    const user = userEvent.setup();
    render(<App />);

    const editBtns = await screen.findAllByRole("button", { name: /edit task/i });
    await user.click(editBtns[0]);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    await user.clear(input);
    await user.type(input, "Renamed task");
    await user.click(screen.getByRole("button", { name: /save task title/i }));

    expect(mockedUpdateTaskTitle).toHaveBeenCalledWith(1, "Renamed task");
  });

  it("AC: saving updates the task in the list without a full reload (fetchTasks called once, on mount only)", async () => {
    mockedFetchTasks.mockResolvedValue(twoTasks);
    mockedUpdateTaskTitle.mockResolvedValue({ ...twoTasks[0], title: "Renamed task" });
    const user = userEvent.setup();
    render(<App />);

    const editBtns = await screen.findAllByRole("button", { name: /edit task/i });
    await user.click(editBtns[0]);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    await user.clear(input);
    await user.type(input, "Renamed task");
    await user.click(screen.getByRole("button", { name: /save task title/i }));

    expect(await screen.findByText("Renamed task")).toBeInTheDocument();
    expect(mockedFetchTasks).toHaveBeenCalledTimes(1);
  });

  it("AC: saving exits edit mode back to read-only view", async () => {
    mockedFetchTasks.mockResolvedValue(twoTasks);
    mockedUpdateTaskTitle.mockResolvedValue({ ...twoTasks[0], title: "Renamed task" });
    const user = userEvent.setup();
    render(<App />);

    const editBtns = await screen.findAllByRole("button", { name: /edit task/i });
    await user.click(editBtns[0]);
    await user.click(screen.getByRole("button", { name: /save task title/i }));

    await screen.findByText("Renamed task");
    expect(screen.queryByRole("textbox", { name: /edit task title/i })).not.toBeInTheDocument();
  });

  it("AC (regression): saving a task does not change list ordering (newest-first by createdAt)", async () => {
    mockedFetchTasks.mockResolvedValue(twoTasks);
    mockedUpdateTaskTitle.mockResolvedValue({ ...twoTasks[0], title: "Renamed task" });
    const user = userEvent.setup();
    render(<App />);

    const editBtns = await screen.findAllByRole("button", { name: /edit task/i });
    await user.click(editBtns[0]);
    await user.click(screen.getByRole("button", { name: /save task title/i }));

    await screen.findByText("Renamed task");
    const titles = document.querySelectorAll(".task-item__title");
    expect(Array.from(titles).map((el) => el.textContent)).toEqual(["Renamed task", "Second task"]);
  });

  it("AC: clicking Cancel discards edits and does not call updateTaskTitle", async () => {
    mockedFetchTasks.mockResolvedValue(twoTasks);
    const user = userEvent.setup();
    render(<App />);

    const editBtns = await screen.findAllByRole("button", { name: /edit task/i });
    await user.click(editBtns[0]);

    const input = screen.getByRole("textbox", { name: /edit task title/i });
    await user.clear(input);
    await user.type(input, "Should not be saved");
    await user.click(screen.getByRole("button", { name: /cancel editing/i }));

    expect(mockedUpdateTaskTitle).not.toHaveBeenCalled();
    expect(screen.getByText("First task")).toBeInTheDocument();
  });
});
