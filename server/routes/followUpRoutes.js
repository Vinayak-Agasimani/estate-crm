const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createFollowUp,
  getFollowUps,
  getFollowUpById,
  updateFollowUp,
} = require("../controllers/followUpController");

const router = express.Router();

router.post("/", protect, createFollowUp);

router.get("/", protect, getFollowUps);

router.get("/:id", protect, getFollowUpById);

router.put("/:id", protect, updateFollowUp);

module.exports = router;