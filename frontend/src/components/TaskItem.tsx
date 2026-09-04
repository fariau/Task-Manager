"use client";

import { Task } from "@/types/task";
import { Check, Undo2, Pencil, Trash2, Clock, AlertTriangle } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: number, status: "pending" | "completed") => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

export default function TaskItem({
  task,
  onToggleStatus,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const isCompleted = task.status === "completed";
  const isOverdue = !isCompleted && new Date(task.due_time) < new Date();

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const borderColor = isCompleted
    ? "border-l-green-500"
    : isOverdue
    ? "border-l-red-500"
    : "border-l-amber-500";

  const statusBadge = isCompleted ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
      <Check size={12} />
      Completed
    </span>
  ) : isOverdue ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
      <AlertTriangle size={12} />
      Overdue
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      <Clock size={12} />
      Pending
    </span>
  );

  return (
    <div
      className={`group relative rounded-xl border border-border bg-surface p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01] border-l-4 ${borderColor}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3
          className={`text-base font-semibold leading-tight ${
            isCompleted
              ? "text-muted line-through"
              : "text-foreground"
          }`}
        >
          {task.title}
        </h3>
        {statusBadge}
      </div>

      {task.description && (
        <p
          className={`mb-3 text-sm leading-relaxed ${
            isCompleted ? "text-muted" : "text-muted"
          }`}
        >
          {task.description}
        </p>
      )}

      <div className="mb-4 flex items-center gap-1 text-xs text-muted">
        <Clock size={14} />
        <span>{formatDateTime(task.due_time)}</span>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3">
        <button
          onClick={() => onToggleStatus(task.id, isCompleted ? "pending" : "completed")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isCompleted
              ? "bg-surface-hover text-muted hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
          }`}
        >
          {isCompleted ? <Undo2 size={14} /> : <Check size={14} />}
          {isCompleted ? "Undo" : "Done"}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface-hover px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
