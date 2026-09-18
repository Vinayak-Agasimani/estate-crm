const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "CALL",
        "WHATSAPP",
        "SITE_VISIT",
        "PROPERTY_SHARED",
        "MEETING",
        "NOTE",
        "NEGOTIATION",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ customerId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);