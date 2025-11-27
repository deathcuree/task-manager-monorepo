import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import type { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (loading) return <Typography>Loading tasks...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (tasks.length === 0) return <Typography>No tasks found.</Typography>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} divider sx={{ flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' } }}>
          <Box sx={{ width: '100%', display: { xs: 'block', md: 'none' } }}>
            {/* Mobile Layout */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="h6">{task.title}</Typography>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
              <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
              <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
            </Box>
            {task.description && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">{task.description}</Typography>
              </Box>
            )}
            <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
              {task.due_date && (
                <Typography variant="body2" color="textSecondary">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => onToggleStatus(task)} color="primary">
                {task.status === 'completed' ? <CheckCircle /> : <RadioButtonUnchecked />}
              </IconButton>
              <IconButton onClick={() => onEdit(task)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(task)} color="error">
                <Delete />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%' }}>
            {/* Desktop Layout */}
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                  <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
                </Box>
              }
              secondary={
                <Box display="flex" flexDirection="column" gap={0.5}>
                  {task.description && <Typography variant="body2">{task.description}</Typography>}
                  <Box display="flex" gap={2}>
                    {task.due_date && (
                      <Typography variant="body2" color="textSecondary">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary">
                      Created: {new Date(task.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => onToggleStatus(task)} color="primary">
                {task.status === 'completed' ? <CheckCircle /> : <RadioButtonUnchecked />}
              </IconButton>
              <IconButton onClick={() => onEdit(task)} color="primary">
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(task)} color="error">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;