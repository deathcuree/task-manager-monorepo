import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

interface TaskFormProps {
  open: boolean;
  task?: Task;
  onSubmit: (data: CreateTaskPayload | UpdateTaskPayload) => void;
  onClose: () => void;
  loading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, task, onSubmit, onClose, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTaskPayload>({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: '',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
      });
    }
  }, [task, reset]);

  const onFormSubmit = (data: CreateTaskPayload) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Title"
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 100, message: 'Title must be less than 100 characters' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              {...register('description', {
                maxLength: { value: 500, message: 'Description must be less than 500 characters' },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  {...register('status')}
                  label="Status"
                  defaultValue="pending"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  {...register('priority')}
                  label="Priority"
                  defaultValue="medium"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              {...register('due_date')}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;