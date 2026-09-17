const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  getCustomer360,
} = require("../controllers/customerController");

const router = express.Router();

// All customer routes require authentication
router.post("/", protect, createCustomer);

router.get("/", protect, getCustomers);

router.get("/:id/360", protect, getCustomer360);

router.get("/:id", protect, getCustomerById);

router.put("/:id", protect, updateCustomer);

module.exports = router;