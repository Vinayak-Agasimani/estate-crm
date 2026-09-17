const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },

    assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },

    date: {
      type: Date,
      required: true,
    },

    purpose: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "MISSED", "CANCELLED"],
      default: "PENDING",
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

followUpSchema.index({
  assignedTo: 1,
  date: 1,
  status: 1,
});

followUpSchema.index({
  customerId: 1,
  date: -1,
});

module.exports = mongoose.model("FollowUp", followUpSchema);