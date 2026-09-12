import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Lead phone number is required'],
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
      default: 'Corporate'
    },
    status: {
      type: String,
      enum: ['Lead', 'In Discussion', 'Site Visit Scheduled', 'Deal Closed', 'Cold / Inactive'],
      default: 'Lead',
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
      trim: true,
      default: 'Sector 62'
    },
    source: {
      type: String,
      enum: ['Direct Call', 'Website Enquiry', '99acres', 'MagicBricks', 'Reference', 'Walk-in'],
      default: 'Direct Call',
      index: true
    },
    followUpDate: {
      type: Date
    },
    siteVisitDetails: {
      propertyTitle: { type: String, default: '' },
      visitDate: { type: Date },
      remarks: { type: String, default: '' }
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate sequential or unique leadId
leadSchema.pre('save', async function (next) {
  if (!this.leadId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.leadId = `LD-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
  next();
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default Lead;
