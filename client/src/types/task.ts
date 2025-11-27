export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface TaskListResponse {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  sort?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}