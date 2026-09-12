import { z } from 'zod';

export const officeQuerySchema = z.object({
  city: z.string().trim().optional(),
  sector: z.string().trim().optional(),
  locality: z.string().trim().optional(),
  keyword: z.string().trim().optional(),
  propertyType: z.string().trim().optional(),
  purpose: z.string().trim().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().positive().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  furnishing: z.string().trim().optional(),
  parking: z.coerce.boolean().optional(),
  floor: z.string().trim().optional(),
  amenities: z.string().trim().optional(),
  status: z.string().trim().optional(),
  sortBy: z.enum(['newest', 'price-asc', 'price-desc', 'area-asc', 'area-desc']).default('newest'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(30),
  skip: z.coerce.number().int().nonnegative().optional(),
  offset: z.coerce.number().int().nonnegative().optional()
});

export const createOfficeSchema = z.object({
  title: z.string().trim().min(2, 'Property Name is required (minimum 2 characters)').max(150),
  propertyType: z.string().trim().min(1, 'Property Type is required'),
  purpose: z.enum(['Rent', 'Sale', 'Lease']).default('Rent'),
  location: z.object({
    city: z.string().trim().default('Noida'),
    sector: z.string().trim().min(1, 'Location / Sector is required'),
    locality: z.string().trim().optional().default(''),
    address: z.string().trim().optional().default('')
  }).transform((loc) => ({
    city: loc.city || 'Noida',
    sector: loc.sector,
    locality: loc.locality || loc.sector,
    address: loc.address || `${loc.sector}, ${loc.city || 'Noida'}`
  })),
  buildingName: z.string().trim().optional().default(''),
  floor: z.string().trim().optional().default('Middle Floor'),
  unitNo: z.string().trim().optional().default(''),
  carpetAreaSqFt: z.coerce.number().positive('Carpet Area must be a positive number'),
  builtUpAreaSqFt: z.coerce.number().positive('Built-up Area must be a positive number'),
  superBuiltUpAreaSqFt: z.coerce.number().nonnegative().optional().default(0),
  furnishing: z.string().trim().default('Full'),
  parking: z.string().trim().optional().default('Available'),
  facing: z.string().trim().optional().default('North-East'),
  availabilityStatus: z.string().trim().default('Available'),
  dataAge: z.string().trim().optional().default('New Construction'),
  listingDate: z.string().optional().default(() => new Date().toISOString()),
  price: z.coerce.number().positive('Selling / Rent Price must be greater than 0'),
  securityDeposit: z.coerce.number().nonnegative().optional().default(0),
  maintenanceCharge: z.coerce.number().nonnegative().optional().default(0),
  ownerName: z.string().trim().min(2, 'Owner Name is required'),
  ownerPhone: z.string().trim().min(10, 'Owner Phone must be at least 10 digits'),
  ownerEmail: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  ownerNotes: z.string().trim().optional().default(''),
  documents: z.array(z.object({ name: z.string(), url: z.string() })).optional().default([]),
  images: z.array(z.object({ url: z.string(), isCover: z.boolean().default(false) })).optional().default([]),
  videoUrl: z.string().trim().optional().default(''),
  internalNotes: z.string().trim().optional().default(''),
  status: z.enum(['Active', 'Expiring', 'Expired', 'Sold', 'Draft']).default('Active')
});
