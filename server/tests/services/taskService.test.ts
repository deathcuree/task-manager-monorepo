import { listTasks, getTask, createTask, updateTask, deleteTask } from '../../src/services/taskService';

// Mock the database functions
jest.mock('../../src/db/db', () => ({
  runQuery: jest.fn(),
  getQuery: jest.fn(),
  allQuery: jest.fn()
}));

import { runQuery, getQuery, allQuery } from '../../src/db/db';

const mockRunQuery = runQuery as jest.MockedFunction<typeof runQuery>;
const mockGetQuery = getQuery as jest.MockedFunction<typeof getQuery>;
const mockAllQuery = allQuery as jest.MockedFunction<typeof allQuery>;

describe('Task Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTasks', () => {
    it('should return paginated tasks with default parameters', () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'pending', priority: 'high' },
        { id: 2, title: 'Task 2', status: 'completed', priority: 'medium' }
      ];

      mockGetQuery.mockReturnValueOnce({ total: 2 });
      mockAllQuery.mockReturnValueOnce(mockTasks);

      const result = listTasks({});

      expect(result.data).toEqual(mockTasks);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should filter by status', () => {
      const mockTasks = [{ id: 1, title: 'Task 1', status: 'pending' }];
      mockGetQuery.mockReturnValueOnce({ total: 1 });
      mockAllQuery.mockReturnValueOnce(mockTasks);

      listTasks({ status: 'pending' });

      expect(mockGetQuery).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM tasks WHERE status = ?',
        ['pending']
      );
      expect(mockAllQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        ['pending', 10, 0]
      );
    });

    it('should filter by priority', () => {
      const mockTasks = [{ id: 1, title: 'Task 1', priority: 'high' }];
      mockGetQuery.mockReturnValueOnce({ total: 1 });
      mockAllQuery.mockReturnValueOnce(mockTasks);

      listTasks({ priority: 'high' });

      expect(mockGetQuery).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM tasks WHERE priority = ?',
        ['high']
      );
    });

    it('should search by title and description', () => {
      const mockTasks = [{ id: 1, title: 'Search Task' }];
      mockGetQuery.mockReturnValueOnce({ total: 1 });
      mockAllQuery.mockReturnValueOnce(mockTasks);

      listTasks({ search: 'search' });

      expect(mockGetQuery).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM tasks WHERE (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))',
        ['%search%', '%search%']
      );
    });

    it('should apply sorting', () => {
      const mockTasks = [{ id: 1, title: 'Task 1' }];
      mockGetQuery.mockReturnValueOnce({ total: 1 });
      mockAllQuery.mockReturnValueOnce(mockTasks);

      listTasks({ sort: 'due_date:asc' });

      expect(mockAllQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY due_date ASC LIMIT ? OFFSET ?',
        [10, 0]
      );
    });

    it('should handle pagination', () => {
      const mockTasks = [{ id: 1, title: 'Task 1' }];
      mockGetQuery.mockReturnValueOnce({ total: 1 });
      mockAllQuery.mockReturnValueOnce(mockTasks);

      listTasks({ page: 2, limit: 5 });

      expect(mockAllQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [5, 5]
      );
    });
  });

  describe('getTask', () => {
    it('should return a task by id', () => {
      const mockTask = { id: 1, title: 'Test Task' };
      mockGetQuery.mockReturnValueOnce(mockTask);

      const result = getTask(1);

      expect(result).toEqual(mockTask);
      expect(mockGetQuery).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = ?', [1]);
    });

    it('should return null for non-existent task', () => {
      mockGetQuery.mockReturnValueOnce(null);

      const result = getTask(999);

      expect(result).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create a new task with defaults', () => {
      const mockTask = {
        id: 1,
        title: 'New Task',
        description: null,
        status: 'pending',
        priority: 'medium',
        due_date: null,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      };

      mockRunQuery.mockReturnValueOnce({ lastInsertRowid: 1, changes: 1 });
      mockGetQuery.mockReturnValueOnce(mockTask);

      const result = createTask({ title: 'New Task' });

      expect(result).toEqual(mockTask);
      expect(mockRunQuery).toHaveBeenCalledWith(
        'INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['New Task', null, 'pending', 'medium', null, expect.any(String), expect.any(String)]
      );
    });

    it('should create a task with all fields provided', () => {
      const payload = {
        title: 'Full Task',
        description: 'Description',
        status: 'in-progress' as const,
        priority: 'high' as const,
        due_date: '2024-12-31'
      };

      const mockTask = {
        id: 2,
        ...payload,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      };

      mockRunQuery.mockReturnValueOnce({ lastInsertRowid: 2, changes: 1 });
      mockGetQuery.mockReturnValueOnce(mockTask);

      const result = createTask(payload);

      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const existingTask = {
        id: 1,
        title: 'Old Title',
        description: 'Old Description',
        status: 'pending',
        priority: 'medium',
        due_date: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      const updatedTask = {
        ...existingTask,
        title: 'New Title',
        updated_at: expect.any(String)
      };

      mockGetQuery.mockReturnValueOnce(existingTask);
      mockRunQuery.mockReturnValueOnce({ changes: 1, lastInsertRowid: 0 });
      mockGetQuery.mockReturnValueOnce(updatedTask);

      const result = updateTask(1, { title: 'New Title' });

      expect(result).toEqual(updatedTask);
      expect(mockRunQuery).toHaveBeenCalledWith(
        'UPDATE tasks SET title = ?, updated_at = ? WHERE id = ?',
        ['New Title', expect.any(String), 1]
      );
    });

    it('should return null for non-existent task', () => {
      mockGetQuery.mockReturnValueOnce(null);

      const result = updateTask(999, { title: 'New Title' });

      expect(result).toBeNull();
      expect(mockRunQuery).not.toHaveBeenCalled();
    });

    it('should update multiple fields', () => {
      const existingTask = {
        id: 1,
        title: 'Old Title',
        description: 'Old Description',
        status: 'pending',
        priority: 'medium',
        due_date: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      const updatedTask = {
        ...existingTask,
        title: 'New Title',
        status: 'completed',
        priority: 'high',
        updated_at: expect.any(String)
      };

      mockGetQuery.mockReturnValueOnce(existingTask);
      mockRunQuery.mockReturnValueOnce({ changes: 1, lastInsertRowid: 0 });
      mockGetQuery.mockReturnValueOnce(updatedTask);

      const result = updateTask(1, {
        title: 'New Title',
        status: 'completed',
        priority: 'high'
      });

      expect(result).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', () => {
      mockRunQuery.mockReturnValueOnce({ changes: 1, lastInsertRowid: 0 });

      const result = deleteTask(1);

      expect(result).toBe(true);
      expect(mockRunQuery).toHaveBeenCalledWith('DELETE FROM tasks WHERE id = ?', [1]);
    });

    it('should return false for non-existent task', () => {
      mockRunQuery.mockReturnValueOnce({ changes: 0, lastInsertRowid: 0 });

      const result = deleteTask(999);

      expect(result).toBe(false);
    });
  });
});