import { z } from 'zod';

// User schema for registration
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Login schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

// Field schema
export const fieldSchema = z.object({
  name: z
    .string()
    .min(1, 'Field name is required')
    .max(100, 'Field name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  crop_type: z
    .string()
    .max(50, 'Crop type must be less than 50 characters')
    .optional(),
  boundary: z
    .any()
    .refine(val => val && val.type === 'Feature' && val.geometry, {
      message: 'Valid GeoJSON boundary is required',
    }),
});

// Satellite data fetch schema
export const satelliteDataFetchSchema = z.object({
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
  cloud_cover: z
    .number()
    .min(0, 'Cloud cover must be at least 0%')
    .max(100, 'Cloud cover must be at most 100%')
    .optional(),
});

