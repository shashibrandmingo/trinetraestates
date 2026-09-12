import { z } from 'zod';

export const addOfficeSchema = z.object({
  title: z.string().min(3, 'Building or office title must be at least 3 characters'),
  sector: z.string().min(2, 'Sector is required (e.g., Sector 62)'),
  areaSqFt: z.coerce.number().positive('Area must be a positive number'),
  rentPerSqFt: z.coerce.number().positive('Rent per Sq. Ft. must be a positive number'),
  furnishing: z.string().min(2, 'Furnishing status is required'),
  metroDistance: z.string().min(2, 'Metro proximity is required'),
  isFeatured: z.boolean().default(false)
});

export type AddOfficeInput = z.infer<typeof addOfficeSchema>;
