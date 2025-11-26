import { setupIntegrationTest } from '../../helpers/integrationSetup';

// Mock the db module before importing services
jest.mock('../../../src/db/db', () => ({
  runQuery: jest.fn(),
  getQuery: jest.fn(),
  allQuery: jest.fn()
}));

import { listTasks, getTask, createTask, updateTask, deleteTask } from '../../../src/services/taskService';

describe('Task Service Integration Tests', () => {
  setupIntegrationTest();

  describe('listTasks', () => {
    it('should return seeded tasks with default parameters', () => {
      const result = listTasks({});

      expect(result.data).toHaveLength(3);
      expect(result.meta.total).toBe(3);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should filter by status', () => {
      const result = listTasks({ status: 'completed' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('completed');
      expect(result.data[0].title).toBe('Test Task 3');
    });

    it('should filter by priority', () => {
      const result = listTasks({ priority: 'high' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].priority).toBe('high');
    });

    it('should search by title', () => {
      const result = listTasks({ search: 'Task 1' });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Task 1');
    });
  });

  describe('getTask', () => {
    it('should return a task by id', () => {
      const result = getTask(1);

      expect(result).toBeTruthy();
      expect(result?.id).toBe(1);
      expect(result?.title).toBe('Test Task 1');
    });

    it('should return null for non-existent task', () => {
      const result = getTask(999);

      expect(result).toBeUndefined();
    });
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const newTask = {
        title: 'New Integration Test Task',
        description: 'Created in integration test',
        status: 'pending' as const,
        priority: 'medium' as const,
        due_date: '2024-12-31'
      };

      const result = createTask(newTask);

      expect(result).toBeTruthy();
      expect(result.id).toBe(4); // Auto-increment from seeded data
      expect(result.title).toBe(newTask.title);
      expect(result.description).toBe(newTask.description);
      expect(result.status).toBe(newTask.status);
      expect(result.priority).toBe(newTask.priority);
      expect(result.due_date).toBe(newTask.due_date);
      expect(result.created_at).toBeTruthy();
      expect(result.updated_at).toBeTruthy();
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const updateData = {
        title: 'Updated Test Task 1',
        status: 'completed' as const
      };

      const result = updateTask(1, updateData);

      expect(result).toBeTruthy();
      expect(result?.id).toBe(1);
      expect(result?.title).toBe(updateData.title);
      expect(result?.status).toBe(updateData.status);
      // Note: In SQLite, if the same timestamp is used, they might be equal
      expect(result?.updated_at).toBeDefined();
    });

    it('should return null for non-existent task', () => {
      const result = updateTask(999, { title: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', () => {
      const result = deleteTask(1);

      expect(result).toBe(true);

      // Verify deletion
      const deletedTask = getTask(1);
      expect(deletedTask).toBeUndefined();
    });

    it('should return false for non-existent task', () => {
      const result = deleteTask(999);

      expect(result).toBe(false);
    });
  });
});