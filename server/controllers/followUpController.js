const FollowUp = require("../models/FollowUp");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");


// CREATE FOLLOW-UP
const createFollowUp = async (req, res) => {
  try {
    const {
      customerId,
      leadId,
      assignedTo,
      date,
      purpose,
      notes,
      status,
    } = req.body;

    // Check customer
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check lead if provided
    if (leadId) {
      const lead = await Lead.findById(leadId);

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found",
        });
      }
    }

    const followUp = await FollowUp.create({
      customerId,
      leadId,
      assignedTo,
      date,
      purpose,
      notes,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Follow-up created successfully",
      data: followUp,
    });
  } catch (error) {
    console.error("Create follow-up error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create follow-up",
      error: error.message,
    });
  }
};


// GET ALL FOLLOW-UPS
const getFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find()
      .populate("customerId", "name phone")
      .populate("leadId", "status priority")
      .populate("assignedTo", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: followUps.length,
      data: followUps,
    });
  } catch (error) {
    console.error("Get follow-ups error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch follow-ups",
      error: error.message,
    });
  }
};


// GET SINGLE FOLLOW-UP
const getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id)
      .populate("customerId", "name phone email")
      .populate("leadId", "status priority")
      .populate("assignedTo", "name email");

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found",
      });
    }

    res.status(200).json({
      success: true,
      data: followUp,
    });
  } catch (error) {
    console.error("Get follow-up error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch follow-up",
      error: error.message,
    });
  }
};


// UPDATE FOLLOW-UP
const updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("customerId", "name phone")
      .populate("leadId", "status priority")
      .populate("assignedTo", "name email");

    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: "Follow-up not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: followUp,
    });
  } catch (error) {
    console.error("Update follow-up error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update follow-up",
      error: error.message,
    });
  }
};


module.exports = {
  createFollowUp,
  getFollowUps,
  getFollowUpById,
  updateFollowUp,
};