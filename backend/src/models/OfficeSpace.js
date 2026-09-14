import mongoose from 'mongoose';

const officeSpaceSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      index: true
    },
    propertyType: {
      type: String,
      enum: ['Office', 'Shop', 'Warehouse', 'Land', 'Co-working', 'Commercial Land', 'Retail Space'],
      default: 'Office',
      index: true
    },
    purpose: {
      type: String,
      enum: ['Rent', 'Sale', 'Lease'],
      default: 'Rent',
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    location: {
      city: { type: String, default: 'Noida', index: true },
      sector: { type: String, required: true, trim: true, index: true },
      locality: { type: String, default: '', index: true },
      address: { type: String, required: true }
    },
    buildingName: {
      type: String,
      default: ''
    },
    floor: {
      type: String,
      default: 'Middle Floor'
    },
    unitNo: {
      type: String,
      default: ''
    },
    areaSqFt: {
      type: Number,
      required: true,
      index: true
    },
    carpetAreaSqFt: {
      type: Number,
      default: 0
    },
    builtUpAreaSqFt: {
      type: Number,
      default: 0
    },
    superBuiltUpAreaSqFt: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: true,
      index: true
    },
    rentPerSqFt: {
      type: Number,
      default: 0
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    maintenanceCharge: {
      type: Number,
      default: 0
    },
    furnishing: {
      type: String,
      default: 'Full'
    },
    parking: {
      type: String,
      default: 'Available'
    },
    facing: {
      type: String,
      default: 'North-East'
    },
    availabilityStatus: {
      type: String,
      default: 'Available'
    },
    dataAge: {
      type: String,
      default: 'New'
    },
    listingDate: {
      type: Date,
      default: Date.now
    },
    daysRemaining: {
      type: Number,
      default: 60
    },
    ownerName: {
      type: String,
      default: ''
    },
    ownerPhone: {
      type: String,
      default: ''
    },
    ownerEmail: {
      type: String,
      default: ''
    },
    ownerNotes: {
      type: String,
      default: ''
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    images: [
      {
        url: { type: String, required: true },
        isCover: { type: Boolean, default: false }
      }
    ],
    videoUrl: {
      type: String,
      default: ''
    },
    internalNotes: {
      type: String,
      default: ''
    },
    amenities: {
      type: [String],
      default: ['Lift', 'Power Backup', 'AC', 'Security']
    },
    status: {
      type: String,
      enum: ['Active', 'Expiring', 'Expired', 'Sold', 'Sold by Me', 'Draft'],
      default: 'Active',
      index: true
    },
    dealDetails: {
      soldBy: { type: String, default: 'None' },
      dealAmount: { type: Number, default: 0 },
      commissionEarned: { type: Number, default: 0 },
      clientName: { type: String, default: '' },
      clientPhone: { type: String, default: '' },
      soldDate: { type: Date },
      paymentMode: { type: String, default: 'Bank Transfer' },
      notes: { type: String, default: '' }
    },
    daysRemaining: {
      type: Number,
      default: 60
    },
    metroDistance: {
      type: String,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for sub-5ms query execution across 40,000+ documents
officeSpaceSchema.index({ status: 1, createdAt: -1 });
officeSpaceSchema.index({ 'location.sector': 1, status: 1, createdAt: -1 });
officeSpaceSchema.index({ 'location.city': 1, 'location.sector': 1, propertyType: 1, status: 1, createdAt: -1 });
officeSpaceSchema.index({ price: 1, status: 1 });
officeSpaceSchema.index({ price: -1, status: 1 });
officeSpaceSchema.index({ areaSqFt: 1, price: 1 });
officeSpaceSchema.index({ isFeatured: -1, createdAt: -1 });

// Full-text index for fast search
officeSpaceSchema.index({
  title: 'text',
  'location.sector': 'text',
  'location.locality': 'text',
  'location.address': 'text',
  buildingName: 'text',
  ownerName: 'text'
});

export const OfficeSpace = mongoose.model('OfficeSpace', officeSpaceSchema);
export default OfficeSpace;
