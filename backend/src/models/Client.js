import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Client phone number is required'],
      trim: true,
      index: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    clientType: {
      type: String,
      enum: ['Buyer', 'Tenant', 'Investor', 'Corporate'],
      default: 'Buyer'
    },
    status: {
      type: String,
      enum: ['Lead', 'In Discussion', 'Site Visit Scheduled', 'Deal Closed', 'Cold / Inactive'],
      default: 'In Discussion',
      index: true
    },
    budget: {
      type: Number,
      default: 0
    },
    requirementSqFt: {
      type: Number,
      default: 0
    },
    preferredSector: {
      type: String,
      default: ''
    },
    propertyId: {
      type: String,
      default: ''
    },
    propertyTitle: {
      type: String,
      default: ''
    },
    dealAmount: {
      type: Number,
      default: 0
    },
    commissionEarned: {
      type: Number,
      default: 0
    },
    paymentMode: {
      type: String,
      default: 'Bank Transfer'
    },
    dealDate: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: 'Direct / Sales by Me'
    },
    followUpDate: {
      type: Date
    },
    siteVisitDetails: {
      propertyId: { type: String, default: '' },
      propertyTitle: { type: String, default: '' },
      visitDate: { type: Date },
      remarks: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

// Auto-assign sequential or timestamp-based clientId
clientSchema.pre('save', async function (next) {
  if (!this.clientId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.clientId = `CL-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
  next();
});

export const Client = mongoose.model('Client', clientSchema);
export default Client;
