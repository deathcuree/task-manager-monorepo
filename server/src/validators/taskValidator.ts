export interface ValidationError {
  field: string;
  message: string;
}

export const validateCreateTask = (payload: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!payload.title || typeof payload.title !== 'string') {
    errors.push({ field: 'title', message: 'Required' });
  } else if (payload.title.length > 100) {
    errors.push({ field: 'title', message: 'Must be 100 characters or less' });
  }

  if (payload.description && typeof payload.description === 'string' && payload.description.length > 500) {
    errors.push({ field: 'description', message: 'Must be 500 characters or less' });
  }

  if (payload.status && !['pending', 'in-progress', 'completed'].includes(payload.status)) {
    errors.push({ field: 'status', message: 'Must be one of: pending, in-progress, completed' });
  }

  if (payload.priority && !['low', 'medium', 'high'].includes(payload.priority)) {
    errors.push({ field: 'priority', message: 'Must be one of: low, medium, high' });
  }

  return errors;
};

export const validateUpdateTask = (payload: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (payload.title !== undefined) {
    if (typeof payload.title !== 'string') {
      errors.push({ field: 'title', message: 'Must be a string' });
    } else if (payload.title.length > 100) {
      errors.push({ field: 'title', message: 'Must be 100 characters or less' });
    }
  }

  if (payload.description !== undefined) {
    if (typeof payload.description !== 'string') {
      errors.push({ field: 'description', message: 'Must be a string' });
    } else if (payload.description.length > 500) {
      errors.push({ field: 'description', message: 'Must be 500 characters or less' });
    }
  }

  if (payload.status !== undefined && !['pending', 'in-progress', 'completed'].includes(payload.status)) {
    errors.push({ field: 'status', message: 'Must be one of: pending, in-progress, completed' });
  }

  if (payload.priority !== undefined && !['low', 'medium', 'high'].includes(payload.priority)) {
    errors.push({ field: 'priority', message: 'Must be one of: low, medium, high' });
  }

  return errors;
};