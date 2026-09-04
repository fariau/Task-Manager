export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_time: string;
  status: "pending" | "completed";
  created_at: string | null;
}

export interface TaskCreate {
  title: string;
  description?: string;
  due_time: string;
  status?: "pending" | "completed";
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  due_time?: string;
  status?: "pending" | "completed";
}
