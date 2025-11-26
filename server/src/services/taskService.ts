import { allQuery, runQuery, getQuery } from '../db/db';
import { Task, CreateTaskPayload, UpdateTaskPayload, TaskListResponse } from '../types/task';

export const listTasks = (params: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  sort?: string;
  search?: string;
}): TaskListResponse => {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 10, 100);
  const offset = (page - 1) * limit;

  let whereClauses: string[] = [];
  let queryParams: any[] = [];

  if (params.status) {
    whereClauses.push('status = ?');
    queryParams.push(params.status);
  }

  if (params.priority) {
    whereClauses.push('priority = ?');
    queryParams.push(params.priority);
  }

  if (params.search) {
    whereClauses.push('(LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))');
    const searchTerm = `%${params.search}%`;
    queryParams.push(searchTerm, searchTerm);
  }

  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM tasks ${whereClause}`;
  const totalResult = getQuery(countQuery, queryParams) as { total: number };
  const total = totalResult.total;

  // Sorting
  let orderBy = 'created_at DESC';
  if (params.sort) {
    const [field, dir] = params.sort.split(':');
    if (['due_date', 'created_at', 'priority'].includes(field) && ['asc', 'desc'].includes(dir)) {
      orderBy = `${field} ${dir.toUpperCase()}`;
    }
  }

  // Get tasks
  const selectQuery = `SELECT * FROM tasks ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  const tasks = allQuery(selectQuery, [...queryParams, limit, offset]) as Task[];

  return {
    data: tasks,
    meta: { page, limit, total }
  };
};

export const getTask = (id: number): Task | null => {
  const query = 'SELECT * FROM tasks WHERE id = ?';
  return getQuery(query, [id]) as Task | null;
};

export const createTask = (payload: CreateTaskPayload): Task => {
  const now = new Date().toISOString();
  const query = `
    INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    payload.title,
    payload.description || null,
    payload.status || 'pending',
    payload.priority || 'medium',
    payload.due_date || null,
    now,
    now
  ];
  const result = runQuery(query, params);
  const id = result.lastInsertRowid as number;
  return getTask(id)!;
};

export const updateTask = (id: number, payload: UpdateTaskPayload): Task | null => {
  const existing = getTask(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updates: string[] = [];
  const params: any[] = [];

  if (payload.title !== undefined) {
    updates.push('title = ?');
    params.push(payload.title);
  }
  if (payload.description !== undefined) {
    updates.push('description = ?');
    params.push(payload.description);
  }
  if (payload.status !== undefined) {
    updates.push('status = ?');
    params.push(payload.status);
  }
  if (payload.priority !== undefined) {
    updates.push('priority = ?');
    params.push(payload.priority);
  }
  if (payload.due_date !== undefined) {
    updates.push('due_date = ?');
    params.push(payload.due_date);
  }
  updates.push('updated_at = ?');
  params.push(now);

  const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
  params.push(id);
  runQuery(query, params);

  return getTask(id);
};

export const deleteTask = (id: number): boolean => {
  const query = 'DELETE FROM tasks WHERE id = ?';
  const result = runQuery(query, [id]);
  return result.changes > 0;
};