import { describe, it, expect, jest, beforeEach } from '@jest/globals';

import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRouter from '../../src/routes/tasks';

// Mock the task service functions
jest.mock('../../src/services/taskService', () => ({
  listTasks: jest.fn(),
  getTask: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
}));

import { listTasks, getTask, createTask, updateTask, deleteTask } from '../../src/services/taskService';

const mockListTasks = listTasks as jest.MockedFunction<typeof listTasks>;
const mockGetTask = getTask as jest.MockedFunction<typeof getTask>;
const mockCreateTask = createTask as jest.MockedFunction<typeof createTask>;
const mockUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;
const mockDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>;

// Load environment variables
dotenv.config();

// Create test app
const createTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }));

  app.use('/api/tasks', taskRouter);

  return app;
};

const app = createTestApp();

describe('Task Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock implementations
    mockListTasks.mockReturnValue({
      data: [
        { id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
        { id: 2, title: 'Test Task 2', description: 'Description for test task 2', status: 'in-progress', priority: 'medium', due_date: '2024-12-25', created_at: '2024-01-02T00:00:00.000Z', updated_at: '2024-01-02T00:00:00.000Z' },
        { id: 3, title: 'Test Task 3', description: 'Description for test task 3', status: 'completed', priority: 'low', created_at: '2024-01-03T00:00:00.000Z', updated_at: '2024-01-03T00:00:00.000Z' }
      ],
      meta: { total: 3, page: 1, limit: 10 }
    });

    mockGetTask.mockImplementation((id) => {
      const tasks = [
        { id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
        { id: 2, title: 'Test Task 2', description: 'Description for test task 2', status: 'in-progress', priority: 'medium', due_date: '2024-12-25', created_at: '2024-01-02T00:00:00.000Z', updated_at: '2024-01-02T00:00:00.000Z' },
        { id: 3, title: 'Test Task 3', description: 'Description for test task 3', status: 'completed', priority: 'low', created_at: '2024-01-03T00:00:00.000Z', updated_at: '2024-01-03T00:00:00.000Z' }
      ];
      return tasks.find(t => t.id === id) || null;
    });

    mockCreateTask.mockImplementation((data) => ({
      id: 4,
      ...data,
      description: data.description,
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      due_date: data.due_date,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    }));

    mockUpdateTask.mockImplementation((id, data) => {
      if (id === 1) {
        const existing = { id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' };
        return { ...existing, ...data, updated_at: '2024-01-01T00:00:00.000Z' };
      }
      return null;
    });

    mockDeleteTask.mockImplementation((id) => id === 1);
  });

  describe('GET /api/tasks', () => {
    it('should return paginated tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('limit', 10);
      expect(response.body.meta).toHaveProperty('total');
    });

    it('should filter by status', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [{ id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }],
        meta: { total: 1, page: 1, limit: 10 }
      });

      const response = await request(app)
        .get('/api/tasks?status=pending')
        .expect(200);

      expect(response.body.data.every((task: any) => task.status === 'pending')).toBe(true);
    });

    it('should filter by priority', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [{ id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }],
        meta: { total: 1, page: 1, limit: 10 }
      });

      const response = await request(app)
        .get('/api/tasks?priority=high')
        .expect(200);

      expect(response.body.data.every((task: any) => task.priority === 'high')).toBe(true);
    });

    it('should handle pagination', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [
          { id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
          { id: 2, title: 'Test Task 2', description: 'Description for test task 2', status: 'in-progress', priority: 'medium', due_date: '2024-12-25', created_at: '2024-01-02T00:00:00.000Z', updated_at: '2024-01-02T00:00:00.000Z' }
        ],
        meta: { total: 3, page: 1, limit: 2 }
      });

      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(2);
    });
  });

  describe('GET /api/tasks/search', () => {
    it('should search tasks by query', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [
          { id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
          { id: 2, title: 'Test Task 2', description: 'Description for test task 2', status: 'in-progress', priority: 'medium', due_date: '2024-12-25', created_at: '2024-01-02T00:00:00.000Z', updated_at: '2024-01-02T00:00:00.000Z' },
          { id: 3, title: 'Test Task 3', description: 'Description for test task 3', status: 'completed', priority: 'low', created_at: '2024-01-03T00:00:00.000Z', updated_at: '2024-01-03T00:00:00.000Z' }
        ],
        meta: { total: 3, page: 1, limit: 10 }
      });

      const response = await request(app)
        .get('/api/tasks/search?q=Test')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      const response = await request(app)
        .get('/api/tasks/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('title');
    });

    it('should return 404 for non-existent task', async () => {
      mockGetTask.mockReturnValueOnce(null);

      const response = await request(app)
        .get('/api/tasks/999')
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Test Task',
        description: 'Created via test',
        status: 'pending',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(response.body.status).toBe(newTask.status);
      expect(response.body.priority).toBe(newTask.priority);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('BAD_REQUEST');
      expect(response.body.error.fields).toContainEqual({
        field: 'title',
        message: 'Required'
      });
    });

    it('should validate field constraints', async () => {
      const invalidTask = {
        title: 'a'.repeat(101), // Too long
        description: 'Valid description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body.error.fields).toContainEqual({
        field: 'title',
        message: 'Must be 100 characters or less'
      });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const updateData = {
        title: 'Updated Task',
        status: 'completed'
      };

      const response = await request(app)
        .put('/api/tasks/1')
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe(updateData.status);
    });

    it('should return 404 for non-existent task', async () => {
      mockUpdateTask.mockReturnValueOnce(null);

      const response = await request(app)
        .put('/api/tasks/999')
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should validate update data', async () => {
      const invalidUpdate = {
        title: 'a'.repeat(101)
      };

      const response = await request(app)
        .put('/api/tasks/1')
        .send(invalidUpdate)
        .expect(400);

      expect(response.body.error.fields).toContainEqual({
        field: 'title',
        message: 'Must be 100 characters or less'
      });
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should partially update a task', async () => {
      const response = await request(app)
        .patch('/api/tasks/1')
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.status).toBe('completed');
    });

    it('should return 404 for non-existent task', async () => {
      mockUpdateTask.mockReturnValueOnce(null);

      const response = await request(app)
        .patch('/api/tasks/999')
        .send({ status: 'completed' })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const response = await request(app)
        .delete('/api/tasks/1')
        .expect(200);

      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      mockGetTask.mockReturnValueOnce(null);
      const getResponse = await request(app)
        .get('/api/tasks/1')
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      mockDeleteTask.mockReturnValueOnce(false);

      const response = await request(app)
        .delete('/api/tasks/999')
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});