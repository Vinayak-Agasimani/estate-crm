const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Property = require("../models/Property");

// CREATE ACTIVITY
const createActivity = async (req, res) => {
  try {
    const {
      customerId,
      leadId,
      propertyId,
      type,
      title,
      description,
    } = req.body;

    // Validate customer ID
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    // Validate customer exists
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Validate activity type
    const allowedTypes = [
      "CALL",
      "WHATSAPP",
      "SITE_VISIT",
      "PROPERTY_SHARED",
      "MEETING",
      "NOTE",
      "NEGOTIATION",
    ];

    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity type",
      });
    }

    // Validate title
    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Activity title is required",
      });
    }

    // Validate optional lead
    if (leadId) {
      if (!mongoose.Types.ObjectId.isValid(leadId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid lead ID",
        });
      }

      const lead = await Lead.findById(leadId);

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found",
        });
      }

      // Make sure the lead belongs to this customer
      if (lead.customerId.toString() !== customerId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Lead does not belong to this customer",
        });
      }
    }

    // Validate optional property
    if (propertyId) {
      if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid property ID",
        });
      }

      const property = await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }
    }

    const activity = await Activity.create({
      customerId,
      leadId: leadId || null,
      propertyId: propertyId || null,
      type,
      title: title.trim(),
      description: description?.trim() || "",
      createdBy: req.user?.userId || null,
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate("createdBy", "name email role")
      .populate("leadId", "status priority")
      .populate(
        "propertyId",
        "title propertyType transactionType price city locality"
      );

    return res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: populatedActivity,
    });
  } catch (error) {
    console.error("Create activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create activity",
      error: error.message,
    });
  }
};

// GET ALL ACTIVITIES FOR A CUSTOMER
const getCustomerActivities = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const activities = await Activity.find({ customerId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role")
      .populate("leadId", "status priority")
      .populate(
        "propertyId",
        "title propertyType transactionType price city locality"
      );

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Get customer activities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer activities",
      error: error.message,
    });
  }
};

// GET SINGLE ACTIVITY
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity ID",
      });
    }

    const activity = await Activity.findById(id)
      .populate("createdBy", "name email role")
      .populate("leadId", "status priority")
      .populate(
        "propertyId",
        "title propertyType transactionType price city locality"
      );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Get activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
      error: error.message,
    });
  }
};

// UPDATE ACTIVITY
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity ID",
      });
    }

    const allowedFields = [
      "type",
      "title",
      "description",
      "leadId",
      "propertyId",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.type) {
      const allowedTypes = [
        "CALL",
        "WHATSAPP",
        "SITE_VISIT",
        "PROPERTY_SHARED",
        "MEETING",
        "NOTE",
        "NEGOTIATION",
      ];

      if (!allowedTypes.includes(updates.type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid activity type",
        });
      }
    }

    if (updates.title !== undefined) {
      if (!updates.title || updates.title.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Activity title is required",
        });
      }

      updates.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      updates.description = updates.description?.trim() || "";
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("createdBy", "name email role")
      .populate("leadId", "status priority")
      .populate(
        "propertyId",
        "title propertyType transactionType price city locality"
      );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity updated successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Update activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update activity",
      error: error.message,
    });
  }
};

// DELETE ACTIVITY
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity ID",
      });
    }

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Delete activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete activity",
      error: error.message,
    });
  }
};

module.exports = {
  createActivity,
  getCustomerActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};