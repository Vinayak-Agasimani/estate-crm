const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
} = require("../controllers/ownerController");

const router = express.Router();

router.get("/", protect, getOwners);

router.get("/:id", protect, getOwnerById);

router.post("/", protect, createOwner);

router.put("/:id", protect, updateOwner);

module.exports = router;