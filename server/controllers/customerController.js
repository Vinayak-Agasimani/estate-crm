const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const FollowUp = require("../models/FollowUp");

// CREATE CUSTOMER
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      requirement,
      notes,
      status,
      assignedAgent,
    } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      requirement,
      notes,
      status,
      assignedAgent,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

// GET CUSTOMER 360
const getCustomer360 = async (req, res) => {
  try {
    const { id } = req.params;

    // Get customer information
    const customer = await Customer.findById(id)
      .populate(
        "assignedAgent",
        "name email phone role"
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Get all leads belonging to this customer
    const leads = await Lead.find({
      customerId: id,
    })
      .populate(
        "propertyId",
        "title propertyType transactionType price city locality status images"
      )
      .populate(
        "assignedAgent",
        "name email phone role"
      )
      .sort({ createdAt: -1 });

    // Get all follow-ups belonging to this customer
    const followUps = await FollowUp.find({
      customerId: id,
    })
      .populate(
        "leadId",
        "status priority propertyId"
      )
      .populate(
        "assignedTo",
        "name email phone role"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: {
        customer,
        leads,
        followUps,
      },
    });
  } catch (error) {
    console.error(
      "Get customer 360 error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer 360 data",
      error: error.message,
    });
  }
};


// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};


// GET SINGLE CUSTOMER
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Get customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
};


// UPDATE CUSTOMER
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};


module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  getCustomer360,
};