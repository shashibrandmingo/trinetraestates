import Lead from '../models/Lead.js';

/**
 * Get all leads with search, filtering, and pagination
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      search,
      status,
      source,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
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
        { preferredSector: regex },
        { notes: regex }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Lead.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: leads,
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
 * Get aggregated lead statistics for fast card rendering
 * GET /api/leads/stats
 */
export const getLeadStats = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const startOfToday = new Date(todayStr);
    const endOfToday = new Date(todayStr);
    endOfToday.setHours(23, 59, 59, 999);

    const [total, inDiscussion, siteVisits, dealClosed, dueFollowUps, newToday] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'In Discussion' }),
      Lead.countDocuments({ status: 'Site Visit Scheduled' }),
      Lead.countDocuments({ status: 'Deal Closed' }),
      Lead.countDocuments({
        followUpDate: { $lte: endOfToday, $ne: null },
        status: { $nin: ['Deal Closed', 'Cold / Inactive'] }
      }),
      Lead.countDocuments({ createdAt: { $gte: startOfToday } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLeads: total || 0,
        inDiscussion: inDiscussion || 0,
        siteVisitsScheduled: siteVisits || 0,
        dealsClosed: dealClosed || 0,
        dueFollowUps: dueFollowUps || 0,
        newLeadsToday: newToday || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new lead
 */
export const createLead = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      company,
      clientType = 'Corporate',
      status = 'Lead',
      budget = 0,
      requirementSqFt = 0,
      preferredSector = 'Sector 62',
      source = 'Direct Call',
      followUpDate,
      siteVisitDetails,
      notes = ''
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and Phone number are required'
      });
    }

    const newLead = new Lead({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      company: company ? company.trim() : '',
      clientType,
      status,
      budget: Number(budget) || 0,
      requirementSqFt: Number(requirementSqFt) || 0,
      preferredSector: preferredSector ? preferredSector.trim() : 'Sector 62',
      source,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      siteVisitDetails: siteVisitDetails || undefined,
      notes: notes ? notes.trim() : ''
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Lead saved successfully',
      data: newLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing lead
 */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('LD-') ? { leadId: id } : { _id: id };

    const updateData = { ...req.body };
    if (updateData.budget !== undefined) updateData.budget = Number(updateData.budget) || 0;
    if (updateData.requirementSqFt !== undefined) {
      updateData.requirementSqFt = Number(updateData.requirementSqFt) || 0;
    }

    const updated = await Lead.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a lead
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('LD-') ? { leadId: id } : { _id: id };

    const deleted = await Lead.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export all leads as CSV
 */
export const exportLeadsCSV = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();
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

    for (const c of leads) {
      const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      const row = [
        escape(c.leadId || c._id),
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
