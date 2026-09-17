const Property = require("../models/Property");

// CREATE PROPERTY
const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("Create property error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create property",
      error: error.message,
    });
  }
};


// GET ALL PROPERTIES
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Get properties error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};


// GET SINGLE PROPERTY
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Get property error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};


// UPDATE PROPERTY
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    console.error("Update property error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update property",
      error: error.message,
    });
  }
};


module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
};