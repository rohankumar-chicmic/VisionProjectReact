import { z } from 'zod';

export const editUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional().or(z.literal('')),
  companyName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .optional()
    .or(z.literal('')),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
