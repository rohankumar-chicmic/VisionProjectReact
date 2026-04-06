import { z } from 'zod';

export const adminSchema = z.object({
  firstName: z.string().min(2, 'First name is required (min 2 chars)'),
  lastName: z.string().min(2, 'Last name is required (min 2 chars)'),
  email: z.email('Invalid email address'),
  role: z.string().min(1, 'Please select a role'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[a-z]/, 'One lowercase letter')
    .regex(/[0-9!@#$%^&*]/, 'One number or special character')
    .optional()
    .or(z.literal('')),
  sendWelcomeEmail: z.boolean().optional(),
});

export const createAdminSchema = adminSchema.extend({
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[a-z]/, 'One lowercase letter')
    .regex(/[0-9!@#$%^&*]/, 'One number or special character'),
});

export const updateAdminSchema = adminSchema;

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;
export type UpdateAdminFormValues = z.infer<typeof updateAdminSchema>;
export type AdminFormValues = z.infer<typeof adminSchema>;
