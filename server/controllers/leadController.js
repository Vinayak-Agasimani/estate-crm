const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Property = require("../models/Property");

// CREATE LEAD
const createLead = async (req, res) => {
  try {
    const {
      customerId,
      propertyId,
      source,
      status,
      priority,
      assignedAgent,
      nextFollowUp,
      notes,
    } = req.body;

    // Check customer exists
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check property exists
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const lead = await Lead.create({
      customerId,
      propertyId,
      source,
      status,
      priority,
      assignedAgent,
      nextFollowUp,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};


// GET ALL LEADS
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("customerId", "name phone email")
      .populate("propertyId", "title price city locality status")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};


// GET SINGLE LEAD
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("customerId", "name phone email requirement")
      .populate(
        "propertyId",
        "title price propertyType transactionType city locality status"
      )
      .populate("assignedAgent", "name email");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Get lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};


// UPDATE LEAD
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("customerId", "name phone")
      .populate("propertyId", "title price status");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};


module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
};