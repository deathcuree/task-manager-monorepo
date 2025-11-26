import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTaskHandler,
  updateTaskHandler,
  patchTaskHandler,
  deleteTaskHandler,
  searchTasks
} from '../controllers/taskController';

const router = Router();

// GET /api/tasks
router.get('/', getTasks);

// GET /api/tasks/search
router.get('/search', searchTasks);

// GET /api/tasks/:id
router.get('/:id', getTaskById);

// POST /api/tasks
router.post('/', createTaskHandler);

// PUT /api/tasks/:id
router.put('/:id', updateTaskHandler);

// PATCH /api/tasks/:id
router.patch('/:id', patchTaskHandler);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTaskHandler);

export default router;