const { z } = require('zod');

const createEmployeeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  alternativePhone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional().transform(v => v ? new Date(v) : undefined),
  profilePicture: z.string().optional(),
  experienceCert: z.string().optional(),
  idProof: z.string().optional(),
  educationCert: z.string().optional(),
  password: z.string().min(6).optional(),
  department: z.string().min(2),
  jobTitle: z.string().min(2),
  status: z.enum(['Active', 'Inactive']).optional(),
  hireDate: z.string().optional().transform(v => v ? new Date(v) : undefined),

  // New fields
  jobGrade: z.string().optional(),
  employmentType: z.string().optional(),
  reportingManager: z.string().optional(),
  workLocation: z.string().optional(),
  qualifications: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    year: z.string().optional()
  })).optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  branchName: z.string().optional(),
  basicSalary: z.number().optional(),
  hra: z.number().optional(),
  specialAllowance: z.number().optional(),
  conveyanceAllowance: z.number().optional(),
  grossSalary: z.number().optional(),
  performanceBonus: z.number().optional(),
  noticePeriod: z.number().int().optional()
});

const updateEmployeeSchema = createEmployeeSchema.partial();

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema
};
