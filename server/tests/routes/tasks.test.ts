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

describe('Task Routes Unit Tests', () => {
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
      created_at: expect.any(String),
      updated_at: expect.any(String)
    }));

    mockUpdateTask.mockImplementation((id, data) => {
      if (id === 1) {
        const existing = { id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' };
        return { ...existing, ...data, updated_at: expect.any(String) };
      }
      return null;
    });

    mockDeleteTask.mockImplementation((id) => id === 1);
  });

  describe('Task CRUD Operations', () => {
    let createdTaskId: number;

    it('should create a task', async () => {
      const taskData = {
        title: 'E2E Test Task',
        description: 'Created in E2E test',
        status: 'pending',
        priority: 'high',
        due_date: '2024-12-31'
      };

      mockCreateTask.mockReturnValueOnce({
        id: 1,
        ...taskData,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.due_date
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');

      createdTaskId = response.body.id;
    });

    it('should get the created task', async () => {
      mockGetTask.mockReturnValueOnce({
        id: 1,
        title: 'E2E Test Task',
        description: 'Created in E2E test',
        status: 'pending',
        priority: 'high',
        due_date: '2024-12-31',
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });

      const response = await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .expect(200);

      expect(response.body.id).toBe(createdTaskId);
      expect(response.body.title).toBe('E2E Test Task');
    });

    it('should update the task', async () => {
      const updateData = {
        title: 'Updated E2E Test Task',
        status: 'in-progress'
      };

      mockUpdateTask.mockReturnValueOnce({
        id: 1,
        title: updateData.title,
        description: 'Created in E2E test',
        status: updateData.status,
        priority: 'high',
        due_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: expect.any(String)
      });

      const response = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.status).toBe(updateData.status);
      expect(response.body.updated_at).not.toBe(response.body.created_at);
    });

    it('should patch the task', async () => {
      const patchData = {
        priority: 'low'
      };

      mockUpdateTask.mockReturnValueOnce({
        id: 1,
        title: 'Updated E2E Test Task',
        description: 'Created in E2E test',
        status: 'in-progress',
        priority: patchData.priority,
        due_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: expect.any(String)
      });

      const response = await request(app)
        .patch(`/api/tasks/${createdTaskId}`)
        .send(patchData)
        .expect(200);

      expect(response.body.priority).toBe(patchData.priority);
    });

    it('should list tasks including the created one', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.meta.total).toBeGreaterThan(0);
    });

    it('should search for the task', async () => {
      const response = await request(app)
        .get('/api/tasks/search?q=E2E')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.some((task: any) => task.id === createdTaskId)).toBe(true);
    });

    it('should delete the task', async () => {
      await request(app)
        .delete(`/api/tasks/${createdTaskId}`)
        .expect(200);

      // Verify deletion
      mockGetTask.mockReturnValueOnce(null);
      await request(app)
        .get(`/api/tasks/${createdTaskId}`)
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid task creation', async () => {
      const invalidData = {
        title: '', // Empty title
        status: 'invalid-status'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toHaveProperty('code', 'BAD_REQUEST');
      expect(Array.isArray(response.body.error.fields)).toBe(true);
    });

    it('should handle non-existent task access', async () => {
      mockGetTask.mockReturnValueOnce(null);
      await request(app)
        .get('/api/tasks/99999')
        .expect(404);

      mockUpdateTask.mockReturnValueOnce(null);
      await request(app)
        .put('/api/tasks/99999')
        .send({ title: 'Test' })
        .expect(404);

      mockUpdateTask.mockReturnValueOnce(null);
      await request(app)
        .patch('/api/tasks/99999')
        .send({ status: 'completed' })
        .expect(404);

      mockDeleteTask.mockReturnValueOnce(false);
      await request(app)
        .delete('/api/tasks/99999')
        .expect(404);
    });
  });

  describe('Filtering and Sorting', () => {
    it('should filter tasks by status', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [{ id: 3, title: 'Test Task 3', description: 'Description for test task 3', status: 'completed', priority: 'low', created_at: '2024-01-03T00:00:00.000Z', updated_at: '2024-01-03T00:00:00.000Z' }],
        meta: { total: 1, page: 1, limit: 10 }
      });

      const response = await request(app)
        .get('/api/tasks?status=completed')
        .expect(200);

      expect(response.body.data.every((task: any) => task.status === 'completed')).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [{ id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }],
        meta: { total: 1, page: 1, limit: 10 }
      });

      const response = await request(app)
        .get('/api/tasks?priority=high')
        .expect(200);

      expect(response.body.data.every((task: any) => task.priority === 'high')).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [{ id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' }],
        meta: { total: 3, page: 1, limit: 1 }
      });

      const response = await request(app)
        .get('/api/tasks?page=1&limit=1')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(1);
    });

    it('should sort tasks by different fields', async () => {
      const response = await request(app)
        .get('/api/tasks?sort=priority:desc')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    it('should search tasks by title', async () => {
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

    it('should search tasks by description', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [
          { id: 1, title: 'Test Task 1', description: 'Description for test task 1', status: 'pending', priority: 'high', due_date: '2024-12-31', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
          { id: 2, title: 'Test Task 2', description: 'Description for test task 2', status: 'in-progress', priority: 'medium', due_date: '2024-12-25', created_at: '2024-01-02T00:00:00.000Z', updated_at: '2024-01-02T00:00:00.000Z' },
          { id: 3, title: 'Test Task 3', description: 'Description for test task 3', status: 'completed', priority: 'low', created_at: '2024-01-03T00:00:00.000Z', updated_at: '2024-01-03T00:00:00.000Z' }
        ],
        meta: { total: 3, page: 1, limit: 10 }
      });

      const response = await request(app)
        .get('/api/tasks/search?q=Description')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return empty results for no matches', async () => {
      mockListTasks.mockReturnValueOnce({
        data: [],
        meta: { total: 0, page: 1, limit: 10 }
      });

      const response = await request(app)
        .get('/api/tasks/search?q=nonexistent')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});