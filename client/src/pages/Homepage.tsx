import { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Add } from '@mui/icons-material';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { listTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import type { Task, TaskFilters as TaskFiltersType, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

const theme = createTheme();

function Homepage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTasks = async (isSearchOperation = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const startTime = Date.now();
    const minLoadingTime = 500; // Minimum 500ms loading time for better UX
    abortControllerRef.current = new AbortController();

    if (isSearchOperation) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await listTasks(
        { ...filters, page, limit: 10 },
        { signal: abortControllerRef.current.signal }
      );
      setTasks(response.data);
      setTotalPages(Math.ceil(response.meta.total / 10));
    } catch (err) {
      // Don't set error if request was aborted or canceled
      if (err instanceof Error && err.name !== 'AbortError' && err.name !== 'CanceledError') {
        setError('Failed to load tasks');
      }
    } finally {
      // Ensure minimum loading time for better UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => {
        if (isSearchOperation) {
          setSearchLoading(false);
        } else {
          setLoading(false);
        }
      }, remainingTime);
    }
  };

  const prevFiltersRef = useRef<TaskFiltersType>({});

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const isSearchChange = prevFiltersRef.current.search !== filters.search;
    fetchTasks(isSearchChange);
    prevFiltersRef.current = filters;
  }, [filters, page]);

  const handleCreate = async (data: CreateTaskPayload) => {
    setFormLoading(true);
    try {
      await createTask(data);
      setFormOpen(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateTaskPayload) => {
    if (!editingTask) return;
    setFormLoading(true);
    try {
      const updatedTask = await updateTask(editingTask.id, data);
      setTasks(prevTasks => prevTasks.map(t => t.id === editingTask.id ? updatedTask : t));
      setFormOpen(false);
      setEditingTask(undefined);
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteTask(deleteConfirm.id);
      setDeleteConfirm(null);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistically update the UI
    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? {...t, status: newStatus} : t));
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (err) {
      // Revert the optimistic update on failure
      setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? {...t, status: task.status} : t));
      setError('Failed to update task status');
    }
  };

  const handleFormSubmit = (data: CreateTaskPayload | UpdateTaskPayload) => {
    if (editingTask) {
      handleUpdate(data as UpdateTaskPayload);
    } else {
      handleCreate(data as CreateTaskPayload);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 2 }}>
        <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' }, textAlign: 'center' }}>
            Task Manager
          </Typography>
          <Box sx={{ display: { xs: 'block', md: 'flex' }, justifyContent: { md: 'center' }, alignItems: { md: 'center' }, mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setFormOpen(true)}
              sx={{ width: { xs: '100%', md: 'auto' }, mt: { xs: 1, md: 0 } }}
            >
              Add Task
            </Button>
          </Box>
          <Filters filters={filters} onChange={setFilters} searchLoading={searchLoading} />
          {error && <ErrorMessage message={error} />}
          {(loading || searchLoading) ? <LoadingSpinner /> : <TaskList
            tasks={tasks}
            loading={false}
            error={null}
            onEdit={(task) => {
              setEditingTask(task);
              setFormOpen(true);
            }}
            onDelete={setDeleteConfirm}
            onToggleStatus={handleToggleStatus}
          />}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Box>
        <TaskForm
          open={formOpen}
          task={editingTask}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(undefined);
          }}
          loading={formLoading}
        />
        <ConfirmDialog
          open={!!deleteConfirm}
          title="Delete Task"
          message={`Are you sure you want to delete "${deleteConfirm?.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Homepage;