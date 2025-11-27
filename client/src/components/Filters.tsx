import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Clear } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskFilters } from '../types/task';

interface FiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  searchLoading?: boolean;
}

const Filters: React.FC<FiltersProps> = ({ filters, onChange, searchLoading = false }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [dueDateFrom, setDueDateFrom] = useState<Dayjs | null>(filters.due_date_from ? dayjs(filters.due_date_from) : null);
  const [dueDateTo, setDueDateTo] = useState<Dayjs | null>(filters.due_date_to ? dayjs(filters.due_date_to) : null);
  const filtersRef = useRef(filters);
  const onChangeRef = useRef(onChange);

  // Update refs when props change
  useEffect(() => {
    filtersRef.current = filters;
    onChangeRef.current = onChange;
  }, [filters, onChange]);

  const handleChange = (key: keyof TaskFilters, value: string) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const handleDateChange = (key: keyof TaskFilters, value: Dayjs | null) => {
    if (key === 'due_date_from') {
      setDueDateFrom(value);
    } else if (key === 'due_date_to') {
      setDueDateTo(value);
    }
    onChange({ ...filters, [key]: value ? value.format('YYYY-MM-DD') : undefined });
  };

  // Effect to debounce search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== filtersRef.current.search) {
        onChangeRef.current({ ...filtersRef.current, search: searchValue || undefined });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Effect to sync local state when filters prop changes
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setDueDateFrom(filters.due_date_from ? dayjs(filters.due_date_from) : null);
  }, [filters.due_date_from]);

  useEffect(() => {
    setDueDateTo(filters.due_date_to ? dayjs(filters.due_date_to) : null);
  }, [filters.due_date_to]);

  return (
    <Box mb={2}>
      <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 2 }}>
        <Box sx={{ minWidth: 200, flex: 1 }}>
          <TextField
            fullWidth
            label="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search title/description"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchLoading ? (
                    <CircularProgress size={20} />
                  ) : searchValue ? (
                    <IconButton
                      size="small"
                      onClick={() => setSearchValue('')}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ minWidth: 150, flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 150, flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority || ''}
              onChange={(e) => handleChange('priority', e.target.value)}
              label="Priority"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 200, flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sort || ''}
              onChange={(e) => handleChange('sort', e.target.value)}
              label="Sort By"
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="due_date:asc">Due Date (Asc)</MenuItem>
              <MenuItem value="due_date:desc">Due Date (Desc)</MenuItem>
              <MenuItem value="created_at:asc">Created (Asc)</MenuItem>
              <MenuItem value="created_at:desc">Created (Desc)</MenuItem>
              <MenuItem value="updated_at:asc">Updated (Asc)</MenuItem>
              <MenuItem value="updated_at:desc">Updated (Desc)</MenuItem>
              <MenuItem value="priority:asc">Priority (Asc)</MenuItem>
              <MenuItem value="priority:desc">Priority (Desc)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 2, mt: 2 }}>
        <Box sx={{ minWidth: 150, flex: 1 }}>
          <DatePicker
            label="Due Date From"
            value={dueDateFrom}
            onChange={(value) => handleDateChange('due_date_from', value)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
        <Box sx={{ minWidth: 150, flex: 1 }}>
          <DatePicker
            label="Due Date To"
            value={dueDateTo}
            onChange={(value) => handleDateChange('due_date_to', value)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Filters;