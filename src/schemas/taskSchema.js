const { z } = require('zod');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

const createTaskSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }).trim().min(1, 'Title cannot be empty'),
  description: z.string().optional().default(''),
  status: z.enum(VALID_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` })
  }).optional().default('pending'),
  priority: z.enum(VALID_PRIORITIES, {
    errorMap: () => ({ message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` })
  }).optional().default('medium')
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').optional(),
  description: z.string().optional(),
  status: z.enum(VALID_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` })
  }).optional(),
  priority: z.enum(VALID_PRIORITIES, {
    errorMap: () => ({ message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` })
  }).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

const updateStatusSchema = z.object({
  status: z.enum(VALID_STATUSES, {
    required_error: 'Status is required',
    errorMap: () => ({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` })
  })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  VALID_STATUSES,
  VALID_PRIORITIES
};
