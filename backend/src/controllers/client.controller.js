import Client from '../models/Client.js';
import { OfficeSpace } from '../models/OfficeSpace.js';

/**
 * Get all clients with filtering, searching, and pagination
 */
export const getClients = async (req, res, next) => {
  try {
    const {
      search,
      status,
      clientType,
      source,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Optional background sync: if there are properties with 'Sold by Me' and clientName, auto-sync to clients
    try {
      const soldOffices = await OfficeSpace.find({
        status: 'Sold by Me',
        'dealDetails.clientName': { $exists: true, $ne: '' }
      }).lean();

      for (const office of soldOffices) {
        const phone = office.dealDetails?.clientPhone || '';
        const name = office.dealDetails?.clientName || '';
        if (name) {
          const existing = await Client.findOne({
            $or: [
              ...(phone ? [{ phone }] : []),
              { name, propertyId: office.propertyId || office._id.toString() }
            ]
          });

          if (!existing) {
            await Client.create({
              name,
              phone: phone || '9876543210',
              clientType: 'Buyer',
              status: 'Deal Closed',
              propertyId: office.propertyId || office._id.toString(),
              propertyTitle: office.title || 'Office Space Noida',
              dealAmount: office.dealDetails?.dealAmount || office.price || 0,
              commissionEarned: office.dealDetails?.commissionEarned || 0,
              paymentMode: office.dealDetails?.paymentMode || 'Bank Transfer',
              dealDate: office.dealDetails?.soldDate || office.updatedAt || new Date(),
              notes: office.dealDetails?.notes || 'Deal closed via Sales by Me',
              source: 'Sales by Me'
            });
          }
        }
      }
    } catch (syncErr) {
      console.error('[Clients Sync] Non-blocking sync error:', syncErr.message);
    }

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (clientType && clientType !== 'all') {
      filter.clientType = clientType;
    }

    if (source && source !== 'all') {
      filter.source = source;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { company: regex },
        { propertyTitle: regex },
        { preferredSector: regex }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [clients, total] = await Promise.all([
      Client.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Client.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: clients,
      total,
      page: safePage,
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Client Statistics (Revenue, Total Clients, Deals Closed, Active Leads)
 */
export const getClientStats = async (req, res, next) => {
  try {
    const [total, dealClosed, activeLeads, corporate, revenueAgg] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: 'Deal Closed' }),
      Client.countDocuments({ status: { $in: ['Lead', 'In Discussion', 'Site Visit Scheduled'] } }),
      Client.countDocuments({ clientType: 'Corporate' }),
      Client.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$commissionEarned' },
            totalVolume: { $sum: '$dealAmount' }
          }
        }
      ])
    ]);

    const totalRevenue = revenueAgg?.[0]?.totalRevenue || 0;
    const totalVolume = revenueAgg?.[0]?.totalVolume || 0;

    res.status(200).json({
      success: true,
      data: {
        totalClients: total || 0,
        dealsClosed: dealClosed || 0,
        activeLeads: activeLeads || 0,
        corporateClients: corporate || 0,
        totalRevenue,
        totalVolume
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new client
 */
export const createClient = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      company,
      clientType = 'Buyer',
      status = 'In Discussion',
      budget = 0,
      requirementSqFt = 0,
      preferredSector = '',
      propertyId = '',
      propertyTitle = '',
      dealAmount = 0,
      commissionEarned = 0,
      paymentMode = 'Bank Transfer',
      dealDate = new Date(),
      notes = '',
      source = 'Direct Call',
      followUpDate,
      siteVisitDetails
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and Phone number are required'
      });
    }

    const newClient = new Client({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      company: company ? company.trim() : '',
      clientType,
      status,
      budget: Number(budget) || 0,
      requirementSqFt: Number(requirementSqFt) || 0,
      preferredSector: preferredSector ? preferredSector.trim() : '',
      propertyId,
      propertyTitle,
      dealAmount: Number(dealAmount) || 0,
      commissionEarned: Number(commissionEarned) || 0,
      paymentMode,
      dealDate: dealDate || new Date(),
      notes: notes ? notes.trim() : '',
      source,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      siteVisitDetails: siteVisitDetails || undefined
    });

    await newClient.save();

    res.status(201).json({
      success: true,
      message: 'Client saved successfully',
      data: newClient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing client
 */
export const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('CL-') ? { clientId: id } : { _id: id };

    const updateData = { ...req.body };
    if (updateData.dealAmount !== undefined) updateData.dealAmount = Number(updateData.dealAmount) || 0;
    if (updateData.commissionEarned !== undefined) updateData.commissionEarned = Number(updateData.commissionEarned) || 0;
    if (updateData.budget !== undefined) updateData.budget = Number(updateData.budget) || 0;
    if (updateData.requirementSqFt !== undefined) updateData.requirementSqFt = Number(updateData.requirementSqFt) || 0;

    const updated = await Client.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a client
 */
export const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('CL-') ? { clientId: id } : { _id: id };

    const deleted = await Client.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export all leads / clients as CSV
 */
export const exportClientsCSV = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    const dateStr = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Noida_Leads_Inquiries_${dateStr}.csv"`
    );

    const headers = [
      'Lead ID',
      'Name',
      'Phone',
      'Email',
      'Company',
      'Client Type',
      'Status',
      'Requirement (Sq.Ft)',
      'Budget (₹)',
      'Preferred Sector',
      'Lead Source',
      'Next Follow-Up',
      'Site Visit Date',
      'Site Visit Property',
      'Notes / Remarks',
      'Created Date'
    ];

    res.write(headers.map((h) => `"${h}"`).join(',') + '\r\n');

    for (const c of clients) {
      const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      const row = [
        escape(c.clientId || c._id),
        escape(c.name || ''),
        escape(c.phone || ''),
        escape(c.email || ''),
        escape(c.company || ''),
        escape(c.clientType || ''),
        escape(c.status || ''),
        c.requirementSqFt || 0,
        c.budget || 0,
        escape(c.preferredSector || ''),
        escape(c.source || ''),
        escape(c.followUpDate ? new Date(c.followUpDate).toLocaleDateString('en-IN') : ''),
        escape(c.siteVisitDetails?.visitDate ? new Date(c.siteVisitDetails.visitDate).toLocaleDateString('en-IN') : ''),
        escape(c.siteVisitDetails?.propertyTitle || ''),
        escape(c.notes || ''),
        escape(c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '')
      ];
      res.write(row.join(',') + '\r\n');
    }

    res.end();
  } catch (error) {
    next(error);
  }
};
