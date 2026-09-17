const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
} = require("../controllers/propertyController");

const router = express.Router();

// Public routes
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// Protected admin routes
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty);

module.exports = router;