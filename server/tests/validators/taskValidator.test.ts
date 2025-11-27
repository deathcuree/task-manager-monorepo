import { describe, it, expect } from '@jest/globals';

import { validateCreateTask, validateUpdateTask } from '../../src/validators/taskValidator';

describe('Task Validators', () => {
  describe('validateCreateTask', () => {
    it('should validate a valid create task payload', () => {
      const payload = {
        title: 'Valid Task',
        description: 'Valid description',
        status: 'pending',
        priority: 'high',
        due_date: '2024-12-31'
      };

      const errors = validateCreateTask(payload);
      expect(errors).toHaveLength(0);
    });

    it('should require title', () => {
      const payload = {
        description: 'No title provided'
      };

      const errors = validateCreateTask(payload);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'Required'
      });
    });

    it('should validate title type', () => {
      const payload = {
        title: 123,
        description: 'Invalid title type'
      };

      const errors = validateCreateTask(payload);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'Required'
      });
    });

    it('should validate title length', () => {
      const payload = {
        title: 'a'.repeat(101), // 101 characters
        description: 'Title too long'
      };

      const errors = validateCreateTask(payload);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'Must be 100 characters or less'
      });
    });

    it('should validate description length', () => {
      const payload = {
        title: 'Valid Title',
        description: 'a'.repeat(501) // 501 characters
      };

      const errors = validateCreateTask(payload);
      expect(errors).toContainEqual({
        field: 'description',
        message: 'Must be 500 characters or less'
      });
    });

    it('should validate status enum values', () => {
      const payload = {
        title: 'Valid Title',
        status: 'invalid-status'
      };

      const errors = validateCreateTask(payload);
      expect(errors).toContainEqual({
        field: 'status',
        message: 'Must be one of: pending, in-progress, completed'
      });
    });

    it('should validate priority enum values', () => {
      const payload = {
        title: 'Valid Title',
        priority: 'invalid-priority'
      };

      const errors = validateCreateTask(payload);
      expect(errors).toContainEqual({
        field: 'priority',
        message: 'Must be one of: low, medium, high'
      });
    });

    it('should allow optional fields to be omitted', () => {
      const payload = {
        title: 'Minimal Task'
      };

      const errors = validateCreateTask(payload);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateUpdateTask', () => {
    it('should validate a valid update task payload', () => {
      const payload = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'completed',
        priority: 'low',
        due_date: '2024-12-31'
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toHaveLength(0);
    });

    it('should allow partial updates', () => {
      const payload = {
        title: 'Updated Title Only'
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toHaveLength(0);
    });

    it('should validate title type when provided', () => {
      const payload = {
        title: 123
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'Must be a string'
      });
    });

    it('should validate title length when provided', () => {
      const payload = {
        title: 'a'.repeat(101)
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toContainEqual({
        field: 'title',
        message: 'Must be 100 characters or less'
      });
    });

    it('should validate description type when provided', () => {
      const payload = {
        description: 123
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toContainEqual({
        field: 'description',
        message: 'Must be a string'
      });
    });

    it('should validate description length when provided', () => {
      const payload = {
        description: 'a'.repeat(501)
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toContainEqual({
        field: 'description',
        message: 'Must be 500 characters or less'
      });
    });

    it('should validate status enum values when provided', () => {
      const payload = {
        status: 'invalid-status'
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toContainEqual({
        field: 'status',
        message: 'Must be one of: pending, in-progress, completed'
      });
    });

    it('should validate priority enum values when provided', () => {
      const payload = {
        priority: 'invalid-priority'
      };

      const errors = validateUpdateTask(payload);
      expect(errors).toContainEqual({
        field: 'priority',
        message: 'Must be one of: low, medium, high'
      });
    });

    it('should allow empty payload', () => {
      const payload = {};

      const errors = validateUpdateTask(payload);
      expect(errors).toHaveLength(0);
    });
  });
});