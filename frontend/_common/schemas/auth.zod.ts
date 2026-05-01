import { z } from 'zod';

export const signInValidationSchema = z.object({
  emailAddress: z.string().email('Provide a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const signUpValidationSchema = z
  .object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters.'),
    emailAddress: z.string().email('Provide a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters.'),
  })
  .refine((value: { password: string; confirmPassword: string }) => value.password === value.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });
