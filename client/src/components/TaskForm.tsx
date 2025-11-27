import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';
import type { Dayjs } from 'dayjs';

interface TaskFormData {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: Dayjs | null;
}

interface TaskFormProps {
  open: boolean;
  task?: Task;
  onSubmit: (data: CreateTaskPayload | UpdateTaskPayload) => void;
  onClose: () => void;
  loading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, task, onSubmit, onClose, loading }) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: null,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? dayjs(task.due_date) : null,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: null,
      });
    }
  }, [task, reset]);

  const onFormSubmit = (data: TaskFormData) => {
    const submitData: CreateTaskPayload = {
      ...data,
      due_date: data.due_date ? data.due_date.format('YYYY-MM-DD') : undefined,
    };
    onSubmit(submitData);
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
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select {...field} label="Priority">
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Controller
              name="due_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Due Date"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              )}
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