import mongoose from 'mongoose';
import { OfficeSpace } from '../models/OfficeSpace.js';
import { officeQuerySchema, createOfficeSchema } from '../validations/office.validation.js';
import { processMediaPayload, saveBase64ToFile } from '../services/storage.service.js';

export const getOffices = async (req, res, next) => {
  try {
    const query = officeQuerySchema.parse(req.query);
    const filter = {};

    const andConditions = [];

    // City filter
    if (query.city && query.city !== 'All Cities') {
      filter['location.city'] = new RegExp(query.city.trim(), 'i');
    }

    // Sector & Locality filter
    if (query.sector && query.sector !== 'All Sectors') {
      filter['location.sector'] = new RegExp(query.sector.trim(), 'i');
    }
    if (query.locality) {
      andConditions.push({
        $or: [
          { 'location.locality': new RegExp(query.locality.trim(), 'i') },
          { 'location.sector': new RegExp(query.locality.trim(), 'i') },
          { 'location.address': new RegExp(query.locality.trim(), 'i') }
        ]
      });
    }

    // Property Type
    if (query.propertyType && query.propertyType !== 'All') {
      filter.propertyType = query.propertyType;
    }

    // Purpose (Rent, Sale, Lease)
    if (query.purpose && query.purpose !== 'All') {
      filter.purpose = query.purpose;
    }

    // Check if any search or specific category filter is active
    const hasSearchOrFilter = Boolean(
      query.keyword ||
      (query.city && query.city !== 'All Cities') ||
      (query.sector && query.sector !== 'All Sectors') ||
      query.locality ||
      (query.propertyType && query.propertyType !== 'All') ||
      (query.purpose && query.purpose !== 'All') ||
      query.minArea ||
      query.maxArea ||
      query.minPrice ||
      query.maxPrice ||
      (query.furnishing && query.furnishing !== 'All') ||
      query.amenities
    );

    // Status filter:
    if (query.status && query.status !== 'All') {
      if (query.status === 'Sold') {
        filter.status = { $in: ['Sold', 'Sold by Me'] };
      } else if (query.status === 'Sold by Me') {
        filter.status = 'Sold by Me';
      } else if (query.status === 'Expiring') {
        filter.daysRemaining = { $gt: 0, $lte: 15 };
        filter.status = { $nin: ['Sold', 'Sold by Me', 'Expired'] };
      } else {
        filter.status = query.status;
      }
    } else if (hasSearchOrFilter) {
      // When searching or applying specific filters, exclude sold properties
      filter.status = { $nin: ['Sold', 'Sold by Me'] };
    }
    // Note: When on TOTAL (no search, no filter), all properties including sold are returned

    // Area range
    if (query.minArea || query.maxArea) {
      filter.areaSqFt = {};
      if (query.minArea) filter.areaSqFt.$gte = query.minArea;
      if (query.maxArea) filter.areaSqFt.$lte = query.maxArea;
    }

    // Price range
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }

    // Furnishing & Parking
    if (query.furnishing && query.furnishing !== 'All') {
      filter.furnishing = query.furnishing;
    }
    if (typeof query.parking === 'boolean') {
      filter.parking = query.parking;
    }

    // Amenities (check array contains all required)
    if (query.amenities) {
      const amenitiesList = query.amenities.split(',').map((a) => a.trim());
      filter.amenities = { $all: amenitiesList };
    }

    // Keyword search across title, propertyId, sector, building, owner, phone, propertyType
    if (query.keyword) {
      const escaped = query.keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(escaped, 'i');
      andConditions.push({
        $or: [
          { title: reg },
          { propertyId: reg },
          { 'location.sector': reg },
          { 'location.locality': reg },
          { 'location.address': reg },
          { buildingName: reg },
          { ownerName: reg },
          { ownerPhone: reg },
          { propertyType: reg },
          { furnishing: reg }
        ]
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    // Sorting definition
    let sortOptions = { isFeatured: -1, createdAt: -1 };
    if (query.sortBy === 'price-asc') sortOptions = { price: 1 };
    if (query.sortBy === 'price-desc') sortOptions = { price: -1 };
    if (query.sortBy === 'area-asc') sortOptions = { areaSqFt: 1 };
    if (query.sortBy === 'area-desc') sortOptions = { areaSqFt: -1 };

    const calculatedSkip =
      typeof query.skip === 'number'
        ? query.skip
        : typeof query.offset === 'number'
        ? query.offset
        : (query.page - 1) * query.limit;

    // Ultra-lightweight card projection: only essentials + 1 image slice from DB
    const cardProjection = {
      propertyId: 1,
      title: 1,
      slug: 1,
      propertyType: 1,
      purpose: 1,
      'location.city': 1,
      'location.sector': 1,
      'location.locality': 1,
      'location.address': 1,
      buildingName: 1,
      floor: 1,
      unitNo: 1,
      areaSqFt: 1,
      carpetAreaSqFt: 1,
      builtUpAreaSqFt: 1,
      price: 1,
      monthlyRentInLakh: 1,
      rentPerSqFt: 1,
      furnishing: 1,
      parking: 1,
      status: 1,
      daysRemaining: 1,
      listingDate: 1,
      createdAt: 1,
      ownerName: 1,
      ownerPhone: 1,
      ownerEmail: 1,
      dealDetails: 1,
      images: { $slice: 1 } // Only fetch 1 image from DB to extract cover thumbnail
    };

    // Only run countDocuments on the first batch (skip === 0) to avoid repeated 40,000-doc counts on scroll
    let rawOffices;
    let total;

    if (calculatedSkip === 0) {
      [rawOffices, total] = await Promise.all([
        OfficeSpace.find(filter, cardProjection)
          .sort(sortOptions)
          .skip(0)
          .limit(query.limit)
          .lean(),
        OfficeSpace.countDocuments(filter)
      ]);
    } else {
      rawOffices = await OfficeSpace.find(filter, cardProjection)
        .sort(sortOptions)
        .skip(calculatedSkip)
        .limit(query.limit)
        .lean();
    }

    // Transform into clean lightweight card payload (NO images array, NO videos, NO descriptions, NO amenities, NO documents)
    const cardOffices = await Promise.all((rawOffices || []).map(async (doc) => {
      let thumbnail = '';
      if (doc.images && doc.images.length > 0) {
        const cover = doc.images.find((img) => img.isCover) || doc.images[0];
        thumbnail = typeof cover === 'string' ? cover : cover?.url || '';
      }

      // If thumbnail is a base64 data URI, auto-convert and save directly to VPS SSD!
      if (thumbnail && thumbnail.startsWith('data:')) {
        const savedUrl = await saveBase64ToFile(thumbnail, `thumb-${doc.propertyId || doc._id}`);
        if (savedUrl && !savedUrl.startsWith('data:')) {
          thumbnail = savedUrl;
          // Async update in DB so next time it's already a clean lightweight URL
          OfficeSpace.updateOne({ _id: doc._id }, { $set: { 'images.0.url': savedUrl } }).catch(() => {});
        }
      }

      const priceNum = Number(doc.price) || 0;
      const rentInLakh =
        doc.monthlyRentInLakh ||
        (priceNum >= 1000 ? Math.round((priceNum / 100000) * 100) / 100 : priceNum);
      const rentPerSqFt =
        doc.rentPerSqFt ||
        (doc.areaSqFt > 0 && priceNum > 0 ? Math.round(priceNum / doc.areaSqFt) : 0);

      // Dynamic 60-day expiration countdown from listingDate or createdAt
      const listDate = new Date(doc.listingDate || doc.createdAt || Date.now());
      const now = Date.now();
      const diffMs = now - listDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const calcDaysRemaining = Math.max(0, 60 - (isNaN(diffDays) ? 0 : diffDays));

      let computedStatus = doc.status || 'Active';
      if (!['Sold', 'Sold by Me', 'Draft'].includes(computedStatus)) {
        if (calcDaysRemaining === 0) {
          computedStatus = 'Expired';
        } else if (calcDaysRemaining <= 15) {
          computedStatus = 'Expiring';
        } else {
          computedStatus = 'Active';
        }

        // Keep DB updated silently in background if status or days drifted
        if (computedStatus !== doc.status || calcDaysRemaining !== doc.daysRemaining) {
          OfficeSpace.updateOne(
            { _id: doc._id },
            { $set: { status: computedStatus, daysRemaining: calcDaysRemaining } }
          ).catch(() => {});
        }
      }

      return {
        _id: doc._id,
        propertyId: doc.propertyId,
        title: doc.title,
        slug: doc.slug,
        propertyType: doc.propertyType || 'Office',
        purpose: doc.purpose || 'Rent',
        location: {
          city: doc.location?.city || 'Noida',
          sector: doc.location?.sector || '',
          locality: doc.location?.locality || '',
          address: doc.location?.address || ''
        },
        buildingName: doc.buildingName || '',
        floor: doc.floor || 'Middle Floor',
        unitNo: doc.unitNo || '',
        areaSqFt: doc.areaSqFt || 0,
        carpetAreaSqFt: doc.carpetAreaSqFt || 0,
        builtUpAreaSqFt: doc.builtUpAreaSqFt || 0,
        price: priceNum,
        monthlyRentInLakh: rentInLakh,
        rentPerSqFt: rentPerSqFt,
        furnishing: doc.furnishing || 'Full',
        parking: doc.parking || 'Available',
        status: computedStatus,
        daysRemaining: calcDaysRemaining,
        superBuiltUpAreaSqFt: doc.superBuiltUpAreaSqFt || 0,
        securityDeposit: doc.securityDeposit || 0,
        maintenanceCharge: doc.maintenanceCharge || 0,
        facing: doc.facing || 'North-East',
        dataAge: doc.dataAge || 'Ready to Move',
        availabilityStatus: doc.availabilityStatus || 'Available',
        listingDate: doc.listingDate || doc.createdAt,
        createdAt: doc.createdAt,
        ownerName: doc.ownerName || '',
        ownerPhone: doc.ownerPhone || '',
        ownerEmail: doc.ownerEmail || '',
        ownerNotes: doc.ownerNotes || '',
        internalNotes: doc.internalNotes || '',
        videoUrl: doc.videoUrl || '',
        thumbnail: thumbnail || '/images/sample-office.png',
        imageUrl: thumbnail || '/images/sample-office.png',
        dealDetails: doc.dealDetails || undefined
      };
    }));

    const hasMore =
      typeof total === 'number'
        ? calculatedSkip + cardOffices.length < total
        : cardOffices.length === query.limit;

    res.status(200).json({
      success: true,
      total,
      count: cardOffices.length,
      page: query.page,
      limit: query.limit,
      skip: calculatedSkip,
      pages: total ? Math.ceil(total / query.limit) : undefined,
      hasMore,
      data: cardOffices
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single property full details by id, propertyId, or slug
 * Returns complete media, all images, videos, floorplans, descriptions & documents
 */
export const getOfficeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let office = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      office = await OfficeSpace.findById(id).lean();
    }
    if (!office) {
      office = await OfficeSpace.findOne({
        $or: [{ propertyId: id }, { slug: id }]
      }).lean();
    }

    if (!office) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: office
    });
  } catch (error) {
    next(error);
  }
};

export const getOfficeStats = async (req, res, next) => {
  try {
    const [total, active, expiring, expired, sold, soldByMe, revenueAggr] = await Promise.all([
      OfficeSpace.countDocuments(),
      OfficeSpace.countDocuments({ status: 'Active' }),
      OfficeSpace.countDocuments({ status: 'Expiring' }),
      OfficeSpace.countDocuments({ status: 'Expired' }),
      OfficeSpace.countDocuments({ status: 'Sold' }),
      OfficeSpace.countDocuments({ status: 'Sold by Me' }),
      OfficeSpace.aggregate([
        { $match: { status: 'Sold by Me' } },
        { $group: { _id: null, totalRevenue: { $sum: '$dealDetails.commissionEarned' } } }
      ])
    ]);

    const totalRevenue = revenueAggr?.[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        total: total || 0,
        active: active || 0,
        expiring: expiring || 0,
        expired: expired || 0,
        sold: sold || 0,
        soldByMe: soldByMe || 0,
        totalRevenue: totalRevenue || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createOffice = async (req, res, next) => {
  try {
    // Automatically save any uploaded base64 images/docs to VPS local disk
    const processedBody = await processMediaPayload(req.body);
    const validatedData = createOfficeSchema.parse(processedBody);

    // Auto-generate unique Property ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const propertyId = `PROP-2026-${randomCode}`;

    // Auto-generate clean slug
    const cleanSlug = `${validatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomCode}`;

    const newOffice = new OfficeSpace({
      ...validatedData,
      propertyId,
      slug: cleanSlug,
      areaSqFt: validatedData.builtUpAreaSqFt || validatedData.carpetAreaSqFt,
      rentPerSqFt: Math.round((validatedData.price * 100000) / (validatedData.builtUpAreaSqFt || 1000))
    });

    await newOffice.save();

    res.status(201).json({
      success: true,
      message: 'Property listed successfully!',
      data: newOffice
    });
  } catch (error) {
    if (error.name === 'ZodError' || error.issues) {
      const issues = error.issues || error.errors || [];
      const firstIssue = issues[0];
      const field = firstIssue?.path?.join('.') || '';
      const message = firstIssue?.message || 'Validation failed';
      const userMessage = field ? `${field}: ${message}` : message;

      return res.status(400).json({
        success: false,
        message: userMessage,
        field,
        errors: issues
      });
    }
    next(error);
  }
};

export const deleteOffice = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await OfficeSpace.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await OfficeSpace.findOneAndDelete({
        $or: [{ propertyId: id }, { slug: id }]
      });
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateOffice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('PROP-') ? { propertyId: id } : { _id: id };

    // Automatically save any updated base64 images/docs to VPS local disk
    const updateData = await processMediaPayload({ ...req.body });

    // Calculate rentPerSqFt and areaSqFt if applicable
    const area = Number(updateData.builtUpAreaSqFt || updateData.carpetAreaSqFt || updateData.areaSqFt);
    const price = Number(updateData.price);
    if (area > 0 && price > 0) {
      updateData.rentPerSqFt = Math.round(price / area);
      updateData.areaSqFt = area;
    } else if (area > 0) {
      updateData.areaSqFt = area;
    }

    if (updateData.location) {
      if (updateData.location.sector) updateData.location.sector = String(updateData.location.sector).trim();
      if (!updateData.location.locality && updateData.location.sector) {
        updateData.location.locality = updateData.location.sector;
      }
    }

    const updated = await OfficeSpace.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const duplicateOffice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.startsWith('PROP-') ? { propertyId: id } : { _id: id };

    const original = await OfficeSpace.findOne(query).lean();
    if (!original) {
      return res.status(404).json({
        success: false,
        message: 'Original property not found'
      });
    }

    // Generate unique propertyId and unique slug
    const newPropertyId = `PROP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const baseSlug = (original.slug || original.title || 'office')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newSlug = `${baseSlug}-${Date.now()}`;

    // Exclude MongoDB internal fields
    const { _id, createdAt, updatedAt, ...rest } = original;

    const duplicatedDoc = new OfficeSpace({
      ...rest,
      propertyId: newPropertyId,
      slug: newSlug,
      title: `${original.title} (Copy)`,
      status: 'Active',
      listingDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await duplicatedDoc.save();

    res.status(201).json({
      success: true,
      message: `Property duplicated successfully as ${newPropertyId}`,
      data: duplicatedDoc
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 1-Click Renew listing: Resets listingDate to now, daysRemaining to 60, and status to Active
 */
export const renewOffice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);
    const query = isObjectId ? { $or: [{ _id: id }, { propertyId: id }] } : { propertyId: id };

    const updated = await OfficeSpace.findOneAndUpdate(
      query,
      {
        $set: {
          listingDate: new Date(),
          daysRemaining: 60,
          status: 'Active'
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Property ${updated.propertyId || ''} renewed successfully for 60 days!`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};


export const purgeTestData = async (req, res, next) => {
  try {
    const filter = {
      $or: [
        { title: { $regex: /test|demo|dummy|sample|abc tower|xyz tower|pqr tower/i } },
        { ownerName: { $regex: /test|dummy|sample/i } }
      ]
    };
    const result = await OfficeSpace.deleteMany(filter);

    res.status(200).json({
      success: true,
      message: `Purged ${result.deletedCount} dummy/test properties from database.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

export const searchOffices = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.status(200).json({
        success: true,
        data: {
          properties: [],
          sectors: [],
          owners: []
        }
      });
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fullReg = new RegExp(escaped, 'i');
    const tokens = q
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    // Build comprehensive search criteria across all corporate fields
    const buildFieldMatch = (reg) => [
      { title: reg },
      { propertyId: reg },
      { 'location.sector': reg },
      { 'location.city': reg },
      { 'location.locality': reg },
      { 'location.address': reg },
      { buildingName: reg },
      { ownerName: reg },
      { ownerPhone: reg },
      { propertyType: reg },
      { purpose: reg },
      { furnishing: reg },
      { description: reg }
    ];

    const statusCondition =
      req.query.status === 'Sold'
        ? { status: { $in: ['Sold', 'Sold by Me'] } }
        : req.query.status === 'Sold by Me'
        ? { status: 'Sold by Me' }
        : { status: { $nin: ['Sold', 'Sold by Me'] } };

    let searchFilter;
    if (tokens.length > 1) {
      // For multi-word queries (e.g. "sector 62 noida" or "galaxy noida"),
      // match documents that satisfy all tokens across fields
      searchFilter = {
        ...statusCondition,
        $and: tokens.map((token) => {
          const tokenReg = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          return { $or: buildFieldMatch(tokenReg) };
        })
      };
    } else {
      searchFilter = {
        ...statusCondition,
        $or: buildFieldMatch(fullReg)
      };
    }

    // Ultra-lightweight search projection: essentials + 1 image slice from DB
    const searchProjection = {
      propertyId: 1,
      title: 1,
      slug: 1,
      propertyType: 1,
      purpose: 1,
      'location.city': 1,
      'location.sector': 1,
      'location.locality': 1,
      'location.address': 1,
      buildingName: 1,
      floor: 1,
      unitNo: 1,
      areaSqFt: 1,
      carpetAreaSqFt: 1,
      builtUpAreaSqFt: 1,
      price: 1,
      monthlyRentInLakh: 1,
      rentPerSqFt: 1,
      furnishing: 1,
      parking: 1,
      status: 1,
      daysRemaining: 1,
      ownerName: 1,
      ownerPhone: 1,
      images: { $slice: 1 } // Only fetch 1 image from DB to extract cover thumbnail
    };

    const rawProperties = await OfficeSpace.find(searchFilter, searchProjection)
      .limit(10)
      .lean();

    // Transform into clean lightweight payload (NO heavy images array, NO videos, NO descriptions, NO documents)
    const properties = await Promise.all(rawProperties.map(async (doc) => {
      let thumbnail = '';
      if (doc.images && doc.images.length > 0) {
        const cover = doc.images.find((img) => img.isCover) || doc.images[0];
        thumbnail = typeof cover === 'string' ? cover : cover?.url || '';
      }

      // If thumbnail is a base64 data URI, auto-convert and save directly to VPS SSD!
      if (thumbnail && thumbnail.startsWith('data:')) {
        const savedUrl = await saveBase64ToFile(thumbnail, `thumb-${doc.propertyId || doc._id}`);
        if (savedUrl && !savedUrl.startsWith('data:')) {
          thumbnail = savedUrl;
        }
      }

      const priceNum = Number(doc.price) || 0;
      const rentInLakh =
        doc.monthlyRentInLakh ||
        (priceNum >= 1000 ? Math.round((priceNum / 100000) * 100) / 100 : priceNum);
      const rentPerSqFt =
        doc.rentPerSqFt ||
        (doc.areaSqFt > 0 && priceNum > 0 ? Math.round(priceNum / doc.areaSqFt) : 0);

      return {
        _id: doc._id,
        propertyId: doc.propertyId,
        title: doc.title,
        slug: doc.slug,
        propertyType: doc.propertyType || 'Office',
        purpose: doc.purpose || 'Rent',
        location: {
          city: doc.location?.city || 'Noida',
          sector: doc.location?.sector || '',
          locality: doc.location?.locality || '',
          address: doc.location?.address || ''
        },
        buildingName: doc.buildingName || '',
        floor: doc.floor || 'Middle Floor',
        unitNo: doc.unitNo || '',
        areaSqFt: doc.areaSqFt || 0,
        carpetAreaSqFt: doc.carpetAreaSqFt,
        builtUpAreaSqFt: doc.builtUpAreaSqFt,
        price: priceNum,
        monthlyRentInLakh: rentInLakh,
        rentPerSqFt,
        furnishing: doc.furnishing || 'Full',
        parking: doc.parking || false,
        status: doc.status || 'Active',
        daysRemaining: doc.daysRemaining ?? 60,
        thumbnail: thumbnail || '/images/sample-office.png',
        imageUrl: thumbnail || '/images/sample-office.png',
        ownerName: doc.ownerName || '',
        ownerPhone: doc.ownerPhone || ''
      };
    }));

    // Distinct sectors matching query or related to Noida
    let sectorFilter = { 'location.sector': fullReg };
    const qLower = q.toLowerCase();
    if (qLower === 'noida' || qLower === 'sector' || qLower === 'office' || qLower.includes('noida')) {
      // If user typed general "noida" or "sector", return all active sectors
      sectorFilter = {};
    }

    const rawSectors = await OfficeSpace.distinct('location.sector', sectorFilter);
    const sectors = rawSectors.filter(Boolean).slice(0, 6);

    // Unique owners matching query
    const ownersFromFound = rawProperties
      .filter((p) => p.ownerName)
      .map((p) => ({
        ownerName: p.ownerName,
        ownerPhone: p.ownerPhone || '',
        propertyTitle: p.title,
        propertyId: p.propertyId
      }));

    // Deduplicate owners by ownerName
    const uniqueOwnersMap = new Map();
    ownersFromFound.forEach((item) => {
      if (!uniqueOwnersMap.has(item.ownerName.toLowerCase())) {
        uniqueOwnersMap.set(item.ownerName.toLowerCase(), item);
      }
    });
    const matchingOwners = Array.from(uniqueOwnersMap.values()).slice(0, 4);

    res.status(200).json({
      success: true,
      data: {
        properties,
        sectors,
        owners: matchingOwners
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk Import properties from Excel / CSV
 * Handles batching and non-blocking bulk inserts
 */
export const bulkImportOffices = async (req, res, next) => {
  try {
    const { properties } = req.body;
    if (!Array.isArray(properties) || properties.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No properties array provided in import payload'
      });
    }

    const timestamp = Date.now();
    const docsToInsert = properties.map((p, idx) => {
      const title = String(p.title || p['Property Name'] || p.name || `Commercial Space ${idx + 1}`).trim();
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSuffix = `${timestamp}-${idx}-${Math.floor(100 + Math.random() * 900)}`;
      const slug = `${baseSlug || 'office'}-${uniqueSuffix}`;

      const price = Number(p.price || p.monthlyRent || p['Monthly Rent'] || p.rent || 50000);
      const area = Number(p.areaSqFt || p.area || p['Area (Sq.Ft.)'] || p.sqft || 1000);
      const sector = String(p.sector || p.location?.sector || p['Sector'] || p.locality || 'Sector 62').trim();
      const city = String(p.city || p.location?.city || p['City'] || 'Noida').trim();

      return {
        propertyId: p.propertyId || `PROP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        title,
        slug,
        propertyType: p.propertyType || p['Property Type'] || 'Office',
        purpose: p.purpose || p['Purpose'] || 'Rent',
        description: p.description || p['Description'] || '',
        location: {
          city,
          sector,
          locality: p.locality || sector,
          address: p.address || `${sector}, ${city}`
        },
        buildingName: p.buildingName || p['Building Name'] || '',
        floor: p.floor || p['Floor'] || 'Middle Floor',
        unitNo: p.unitNo || p['Unit No'] || '',
        areaSqFt: area,
        carpetAreaSqFt: Number(p.carpetAreaSqFt || Math.round(area * 0.7)),
        builtUpAreaSqFt: Number(p.builtUpAreaSqFt || area),
        superBuiltUpAreaSqFt: Number(p.superBuiltUpAreaSqFt || Math.round(area * 1.2)),
        price,
        rentPerSqFt: area > 0 ? Math.round(price / area) : 0,
        furnishing: p.furnishing || p['Furnishing'] || 'Full',
        parking: p.parking || 'Available',
        status: p.status || p['Status'] || 'Active',
        ownerName: p.ownerName || p['Owner Name'] || 'Direct Owner',
        ownerPhone: p.ownerPhone || p['Owner Phone'] || '',
        ownerEmail: p.ownerEmail || p['Owner Email'] || '',
        listingDate: new Date(),
        images: p.imageUrl ? [{ url: p.imageUrl, isCover: true }] : []
      };
    });

    const inserted = await OfficeSpace.insertMany(docsToInsert, { ordered: false });

    res.status(201).json({
      success: true,
      insertedCount: inserted.length,
      totalReceived: properties.length,
      message: `Successfully imported ${inserted.length} properties.`
    });
  } catch (error) {
    if (error.insertedDocs && error.insertedDocs.length > 0) {
      return res.status(207).json({
        success: true,
        insertedCount: error.insertedDocs.length,
        message: `Partially imported ${error.insertedDocs.length} properties (some duplicates skipped).`
      });
    }
    next(error);
  }
};

/**
 * High-performance streaming CSV export for 40,000+ properties
 * Streams data directly using Mongo cursor with near-zero memory footprint
 */
export const exportOfficesCSV = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    if (req.query.sector && req.query.sector !== 'All Sectors') {
      filter['location.sector'] = new RegExp(req.query.sector.trim(), 'i');
    }
    if (req.query.propertyType && req.query.propertyType !== 'All') {
      filter.propertyType = req.query.propertyType;
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Noida_Properties_Export_${dateStr}.csv"`
    );

    const headers = [
      'Property ID',
      'Property Name',
      'Property Type',
      'Purpose',
      'Sector',
      'City',
      'Locality',
      'Building Name',
      'Area (Sq.Ft.)',
      'Monthly Rent (₹)',
      'Rent Per Sq.Ft. (₹)',
      'Furnishing',
      'Parking',
      'Status',
      'Owner Name',
      'Owner Phone',
      'Owner Email',
      'Listing Date'
    ];

    res.write(headers.map((h) => `"${h}"`).join(',') + '\r\n');

    const cursor = OfficeSpace.find(filter).sort({ createdAt: -1 }).cursor();

    for await (const doc of cursor) {
      const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      const row = [
        escape(doc.propertyId || ''),
        escape(doc.title || ''),
        escape(doc.propertyType || 'Office'),
        escape(doc.purpose || 'Rent'),
        escape(doc.location?.sector || ''),
        escape(doc.location?.city || 'Noida'),
        escape(doc.location?.locality || ''),
        escape(doc.buildingName || ''),
        doc.areaSqFt || 0,
        doc.price || 0,
        doc.rentPerSqFt || 0,
        escape(doc.furnishing || ''),
        escape(doc.parking || ''),
        escape(doc.status || 'Active'),
        escape(doc.ownerName || ''),
        escape(doc.ownerPhone || ''),
        escape(doc.ownerEmail || ''),
        escape(doc.createdAt ? new Date(doc.createdAt).toISOString().slice(0, 10) : '')
      ];
      res.write(row.join(',') + '\r\n');
    }

    res.end();
  } catch (error) {
    next(error);
  }
};

