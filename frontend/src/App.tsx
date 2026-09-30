import { useCallback, useEffect, useState } from "react";
import type { Task } from "./types/task";
import { createTask, deleteTask, fetchTasks, updateTaskStatus, updateTaskTitle } from "./services/taskApi";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Data-fetching effect: setState calls inside loadTasks only run after the awaited fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(title: string) {
    setError(null);
    setStatusMessage(null);
    try {
      await createTask(title);
      setStatusMessage("Task added.");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task.");
    }
  }

  async function handleToggleStatus(task: Task) {
    const nextStatus = task.status === "OPEN" ? "COMPLETED" : "OPEN";
    setError(null);
    setStatusMessage(null);
    setBusyTaskId(task.id);
    try {
      await updateTaskStatus(task.id, nextStatus);
      setStatusMessage("Task updated.");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleDelete(task: Task) {
    setError(null);
    setStatusMessage(null);
    setBusyTaskId(task.id);
    try {
      await deleteTask(task.id);
      setStatusMessage("Task deleted.");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  function handleEnterEdit(taskId: number) {
    // Pure ui state: no API call to enter edit mode.
    // Only one task at a time can be in edit mode.
    setEditingTaskId(taskId);
  }

  async function handleSaveTitle(taskId: number, newTitle: string) {
    setError(null);
    setStatusMessage(null);
    setBusyTaskId(taskId);
    try {
      const updated = await updateTaskTitle(taskId, newTitle);

      // Update local state in-place to avoid a full list reload.
      // Preserve order by createdAt (newest-first) by keeping the array order.
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      setEditingTaskId(null);
      setStatusMessage("Task updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  function handleCancelEdit(taskId: number) {
    setEditingTaskId((current) => (current === taskId ? null : current));
  }

  return (
    <main className="app">
      <h1>TaskLite</h1>

      <TaskForm onCreate={handleCreate} disabled={loading} />

      {error && (
        <p role="alert" className="app__message app__message--error">
          {error}
        </p>
      )}
      {!error && statusMessage && (
        <p role="status" className="app__message app__message--success">
          {statusMessage}
        </p>
      )}

      <TaskList
        tasks={tasks}
        loading={loading}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onEnterEdit={handleEnterEdit}
        onCancelEdit={handleCancelEdit}
        onSaveTitle={handleSaveTitle}
        editingTaskId={editingTaskId}
        busyTaskId={busyTaskId}
      />
    </main>
  );
}

export default App;
