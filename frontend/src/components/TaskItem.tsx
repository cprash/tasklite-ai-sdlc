import { useEffect, useRef, useState } from "react";
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEnterEdit: (taskId: number) => void;
  onCancelEdit: () => void;
  onSaveTitle: (taskId: number, newTitle: string) => void;
  isEditing: boolean;
  disabled: boolean;
}

export function TaskItem({
  task,
  onDoggleStatus,
  onDelete,
  onEnterEdit,
  onCancelEdit,
  onSaveTitle,
  isEditing,
  disabled,
}: TaskItemProps) {
  const isCompleted = task.status === "COMPLETED";
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const [editTitle, setEditTitle] = useState(task.title);

  useEffect(() => {
    if (isEditing) {
      setEditTitle(task.title);
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing, task.title]);

  function handleSave() {
    onSaveTitle(task.id, editTitle);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <li
      className=`
        task-item${isCompleted ? " task-item--completed" : ""}      `
}
        ?{
          isEditing ? (
            <input
              ref={editInputRef}              type="text"
              aria-label="Edit task title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}              disabled={disabled}            />
          ) : (            <>
              <span className="task-item__title">{task.title}</span>
              {isCompleted && (
                <span className="task-item__badge">Completed</span>
              )}
            </>
         )
        }        <div className="task-item__actions">
         {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={disabled}              aria-label="Save task title"            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={disabled}
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </>
        ) : (          <>
            <button
              type="button"
              onClick={() => onEnterEdit(task.id)}              disabled={disabled}              aria-label="Edit task"            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus(task)}              disabled={disabled}            >
              {isCompleted ? "Mark Open" : "Mark Complete"}
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              disabled={disabled}            >
              Delete
            </button>
          </>
        )
        }      </div>
    </li>
  );
}
