const { z } = require('zod');

const createEmployeeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().min(2),
  jobTitle: z.string().min(2),
  status: z.enum(['Active', 'Inactive']).optional(),
  hireDate: z.string().optional().transform(v => v ? new Date(v) : undefined)
});

const updateEmployeeSchema = createEmployeeSchema.partial();

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema
};
