const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createActivity,
  getCustomerActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

const router = express.Router();

// Create activity
router.post("/", protect, createActivity);

// Get all activities for a customer
router.get("/customer/:customerId", protect, getCustomerActivities);

// Get single activity
router.get("/:id", protect, getActivityById);

// Update activity
router.put("/:id", protect, updateActivity);

// Delete activity
router.delete("/:id", protect, deleteActivity);

module.exports = router;