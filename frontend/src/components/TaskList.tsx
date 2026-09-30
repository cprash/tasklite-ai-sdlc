import type { Task } from "../types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleStatus: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEnterEdit: (taskId: number) => void;
  onCancelEdit: (taskId: number) => void;
  onSaveTitle: (taskId: number, newTitle: string) => void;
  editingTaskId: number | null;
  busyTaskId: number | null;
}

export function TaskList({
  tasks,
  loading,
  onToggleStatus,
  onDelete,
  onEnterEdit,
  onCancelEdit,
  onSaveTitle,
  editingTaskId,
  busyTaskId,
}: TaskListProps) {
  if (loading) {
    return <p role="status">Loading tasks…</p>;
  }

  if (tasks.length === 0) {
    return <p>No tasks yet. Add one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onEnterEdit={onEnterEdit}
          onCancelEdit={onCancelEdit}
          onSaveTitle={onSaveTitle}
          isEditing={editingTaskId === task.id}
          disabled={busyTaskId === task.id}
        />
      ))}
    </ul>
  );
}
