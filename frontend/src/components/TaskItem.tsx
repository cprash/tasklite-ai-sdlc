import { useEffect, useRef } from "react";
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEnterEdit: (taskId: number) => void;
  isEditing: boolean;
  disabled: boolean;
}

export function TaskItem({ task, onToggleStatus, onDelete, onEnterEdit, isEditing, disabled }: TaskItemProps) {
  const isCompleted = task.status === "COMPLETED";
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <li className=`task-item${isCompleted ? " task-item--completed" : ""}`>
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          aria-label="Edit task title"
          defaultValue={task.title}
          disabled={disabled}
        />
      ) : (
        <>
          <span className="task-item__title">{task.title}</span>
          {isCompleted && <span className="task-item__badge">Completed</span>}
        </>
      )}

      <div className="task-item__actions">
        <!-- Enter edit mode: no API call -->
        <button
          type="button"
          onClick=(() => onEnterEdit(task.id))
          disabled={disabled}
          aria-label="Edit task"
        >
          Edit
        </button>
        <button
          type="button"
          onClick="() => onToggleStatus(task)"
          disabled={disabled}
        >
          {isCompleted ? "Mark Open" : "Mark Complete"}
        </button>
        <button
          type="button"
          onClick="() => onDelete(task)"
          disabled={disabled}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
