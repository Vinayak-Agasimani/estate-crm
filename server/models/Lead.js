const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    source: {
      type: String,
      enum: [
        "WEBSITE",
        "WHATSAPP",
        "PHONE",
        "INSTAGRAM",
        "FACEBOOK",
        "REFERRAL",
        "WALK_IN",
        "OTHER",
      ],
      default: "WEBSITE",
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "PROPERTY_SHARED",
        "SITE_VISIT",
        "INTERESTED",
        "NEGOTIATION",
        "BOOKED",
        "WON",
        "LOST",
      ],
      default: "NEW",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    nextFollowUp: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ customerId: 1 });
leadSchema.index({ propertyId: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ nextFollowUp: 1 });

module.exports = mongoose.model("Lead", leadSchema);