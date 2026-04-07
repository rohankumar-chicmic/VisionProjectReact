import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['organiser', 'admin', 'jury']),
  rememberMe: z.boolean().optional(),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'One uppercase letter')
      .regex(/[a-z]/, 'One lowercase letter')
      .regex(/[0-9!@#$%^&*]/, 'One number or special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Organiser Registration - Step 1
export const organiserStep1Schema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[a-z]/, 'One lowercase letter')
    .regex(/[0-9!@#$%^&*]/, 'One number or special character'),
});

// Organiser Registration - Step 2
export const organiserStep2Schema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  industryType: z.enum([
    'Technology',
    'Services',
    'Retail',
    'Construction',
    'Health',
    'Education',
    'Other',
  ]),
});

// Organiser Registration - Step 3
export const organiserStep3Schema = z.object({
  govtId: z
    .any()
    .refine(
      (val) =>
        val instanceof File ||
        (typeof val === 'string' && val.trim().length > 0),
      'Government ID is required'
    ),
});

// Combined Schema for Organiser Registration
export const organiserRegistrationSchema = z.object({
  ...organiserStep1Schema.shape,
  ...organiserStep2Schema.shape,
  ...organiserStep3Schema.shape,
});

// Types for TypeScript
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type OrganiserStep1Values = z.infer<typeof organiserStep1Schema>;
export type OrganiserStep2Values = z.infer<typeof organiserStep2Schema>;
export type OrganiserStep3Values = z.infer<typeof organiserStep3Schema>;
export type OrganiserRegistrationValues = z.infer<
  typeof organiserRegistrationSchema
>;
