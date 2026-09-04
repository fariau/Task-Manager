"use client";

import { Task } from "@/types/task";
import TaskItem from "./TaskItem";
import { Inbox } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: number, status: "pending" | "completed") => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: Task) => void;
}

export default function TaskList({
  tasks,
  onToggleStatus,
  onDelete,
  onEdit,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 py-16 text-center">
        <Inbox size={48} className="mb-4 text-muted" />
        <p className="text-lg font-medium text-foreground">No tasks found</p>
        <p className="mt-1 text-sm text-muted">
          Try adjusting your search or filters, or add a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
