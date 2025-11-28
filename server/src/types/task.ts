export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
}

export interface TaskListResponse {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sort?: string;
  due_date_from?: string;
  due_date_to?: string;
  due_today?: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: { field: string; message: string }[];
  };
}