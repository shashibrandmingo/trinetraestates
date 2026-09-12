import { z } from 'zod';

export const officeFilterSchema = z.object({
  sector: z.string().default('All Sectors'),
  keyword: z.string().trim().default(''),
  minArea: z.number().nonnegative().optional(),
  maxArea: z.number().positive().optional(),
  furnishing: z.string().optional()
});

export type OfficeFilterValues = z.infer<typeof officeFilterSchema>;
