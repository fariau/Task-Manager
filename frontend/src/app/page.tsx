"use client";

import { useState, useEffect, useMemo } from "react";
import { Task, TaskCreate } from "@/types/task";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Header from "@/components/Header";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FilterStatus = "all" | "pending" | "completed" | "overdue";
type SortOption = "due-soon" | "due-latest" | "newest" | "alphabetical";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("due-soon");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskCreate) => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      await fetchTasks();
      setShowForm(false);
    }
  };

  const handleUpdateTask = async (taskData: TaskCreate) => {
    if (!editingTask) return;
    const res = await fetch(`${API_URL}/tasks/${editingTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      await fetchTasks();
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchTasks();
    }
  };

  const handleToggleStatus = async (
    id: number,
    status: "pending" | "completed"
  ) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchTasks();
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    if (filterStatus === "overdue") {
      result = result.filter(
        (task) =>
          task.status === "pending" && new Date(task.due_time) < new Date()
      );
    } else if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus);
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "due-soon":
          return new Date(a.due_time).getTime() - new Date(b.due_time).getTime();
        case "due-latest":
          return new Date(b.due_time).getTime() - new Date(a.due_time).getTime();
        case "newest":
          return (b.id || 0) - (a.id || 0);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, searchQuery, filterStatus, sortOption]);

  const taskCounts = useMemo(() => {
    const now = new Date();
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      overdue: tasks.filter(
        (t) => t.status === "pending" && new Date(t.due_time) < now
      ).length,
    };
  }, [tasks]);

  const filterButtons: { value: FilterStatus; label: string; count: number }[] = [
    { value: "all", label: "All", count: taskCounts.all },
    { value: "pending", label: "Pending", count: taskCounts.pending },
    { value: "completed", label: "Completed", count: taskCounts.completed },
    { value: "overdue", label: "Overdue", count: taskCounts.overdue },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilterStatus(btn.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filterStatus === btn.value
                    ? "bg-accent text-white"
                    : "bg-surface text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <Filter size={14} />
                {btn.label}
                <span className="ml-0.5 text-xs opacity-70">({btn.count})</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <ArrowUpDown
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-border bg-surface py-2 pl-9 pr-8 text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="due-soon">Due Date (soonest)</option>
              <option value="due-latest">Due Date (latest)</option>
              <option value="newest">Recently Added</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : (
          <TaskList
            tasks={filteredAndSortedTasks}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTask}
            onEdit={handleEdit}
          />
        )}
      </main>

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description || "",
                  due_time: editingTask.due_time.slice(0, 16),
                }
              : undefined
          }
          isEditing={!!editingTask}
          onClose={() => {
            setEditingTask(null);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
