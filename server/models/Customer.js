const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    requirement: {
      purpose: {
        type: String,
        enum: ["BUY", "RENT", "LEASE"],
      },

      propertyTypes: [
        {
          type: String,
          trim: true,
        },
      ],

      preferredLocations: [
        {
          type: String,
          trim: true,
        },
      ],

      minBudget: {
        type: Number,
        min: 0,
      },

      maxBudget: {
        type: Number,
        min: 0,
      },

      bedrooms: {
        type: Number,
        min: 0,
      },

      minArea: {
        type: Number,
        min: 0,
      },

      amenities: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CONVERTED", "INACTIVE"],
      default: "ACTIVE",
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

module.exports = mongoose.model("Customer", customerSchema);