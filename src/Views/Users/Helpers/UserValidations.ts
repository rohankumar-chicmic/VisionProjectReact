import { z } from 'zod';

export const editUserSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  companyName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .optional()
    .or(z.literal('')),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;
