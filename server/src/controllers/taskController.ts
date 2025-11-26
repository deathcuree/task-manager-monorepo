import { Request, Response } from 'express';
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../services/taskService';
import { validateCreateTask, validateUpdateTask } from '../validators/taskValidator';
import { CreateTaskPayload, UpdateTaskPayload, ErrorResponse } from '../types/task';

export const getTasks = (req: Request, res: Response) => {
  try {
    const params = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      status: req.query.status as string,
      priority: req.query.priority as string,
      sort: req.query.sort as string,
      search: req.query.search as string,
    };
    const result = listTasks(params);
    if (result.data.length === 0) {
      result.message = 'No results found.';
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
};

export const getTaskById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const task = getTask(id);
    if (!task) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
};

export const createTaskHandler = (req: Request, res: Response) => {
  try {
    const payload: CreateTaskPayload = req.body;
    const errors = validateCreateTask(payload);
    if (errors.length > 0) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Validation failed', fields: errors } });
    }
    const task = createTask(payload);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
};

export const updateTaskHandler = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const payload: UpdateTaskPayload = req.body;
    const errors = validateUpdateTask(payload);
    if (errors.length > 0) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Validation failed', fields: errors } });
    }
    const task = updateTask(id, payload);
    if (!task) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
};

export const patchTaskHandler = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const payload: Partial<UpdateTaskPayload> = req.body;
    const errors = validateUpdateTask(payload);
    if (errors.length > 0) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Validation failed', fields: errors } });
    }
    const task = updateTask(id, payload);
    if (!task) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
};

export const deleteTaskHandler = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = deleteTask(id);
    if (!deleted) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
};

export const searchTasks = (req: Request, res: Response) => {
  try {
    const params = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      status: req.query.status as string,
      priority: req.query.priority as string,
      sort: req.query.sort as string,
      search: req.query.q as string, 
    };
    const result = listTasks(params);
    if (result.data.length === 0) {
      result.message = 'No results found.';
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
  }
};