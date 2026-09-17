const Owner = require("../models/Owner");

// CREATE OWNER
const createOwner = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Owner name is required",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Owner phone number is required",
      });
    }

    const owner = await Owner.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || undefined,
      address: address?.trim() || "",
      notes: notes?.trim() || "",
      createdBy: req.user?.userId,
      updatedBy: req.user?.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Owner created successfully",
      data: owner,
    });
  } catch (error) {
    console.error("Create owner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create owner",
      error: error.message,
    });
  }
};

// GET ALL OWNERS
const getOwners = async (req, res) => {
  try {
    const owners = await Owner.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: owners.length,
      data: owners,
    });
  } catch (error) {
    console.error("Get owners error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owners",
      error: error.message,
    });
  }
};

// GET SINGLE OWNER
const getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: owner,
    });
  } catch (error) {
    console.error("Get owner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner",
      error: error.message,
    });
  }
};

// UPDATE OWNER
const updateOwner = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      notes,
    } = req.body;

    const owner = await Owner.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && {
          name: name.trim(),
        }),

        ...(phone !== undefined && {
          phone: phone.trim(),
        }),

        ...(email !== undefined && {
          email: email.trim(),
        }),

        ...(address !== undefined && {
          address: address.trim(),
        }),

        ...(notes !== undefined && {
          notes: notes.trim(),
        }),

        updatedBy: req.user?.userId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Owner updated successfully",
      data: owner,
    });
  } catch (error) {
    console.error("Update owner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update owner",
      error: error.message,
    });
  }
};

module.exports = {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
};