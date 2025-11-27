import axios from './axios';
import type { Task, TaskListResponse, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

export const listTasks = async (
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    sort?: string;
    search?: string;
  },
  config?: { signal?: AbortSignal }
): Promise<TaskListResponse> => {
  const response = await axios.get('/tasks', { params, ...config });
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await axios.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await axios.post('/tasks', payload);
  return response.data;
};

export const updateTask = async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
  const response = await axios.put(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`/tasks/${id}`);
};