const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    images: {
    type: [String],
    default: [],
    },

    propertyType: {
      type: String,
      enum: [
        "APARTMENT",
        "VILLA",
        "HOUSE",
        "PLOT",
        "COMMERCIAL",
        "OFFICE",
        "SHOP",
        "OTHER",
      ],
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["SALE", "RENT", "LEASE"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    area: {
      type: Number,
      min: 0,
    },

    bedrooms: {
      type: Number,
      min: 0,
    },

    bathrooms: {
      type: Number,
      min: 0,
    },

    parking: {
      type: Number,
      min: 0,
      default: 0,
    },

    furnishing: {
      type: String,
      enum: ["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"],
    },

    facing: {
      type: String,
      trim: true,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    address: {
      type: String,
      trim: true,
    },

    locality: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },

      coordinates: {
        type: [Number],
      },
    },

    mapUrl: {
      type: String,
      trim: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },

    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "UNDER_DISCUSSION",
        "BOOKED",
        "SOLD",
        "RENTED",
        "ARCHIVED",
      ],
      default: "AVAILABLE",
    },

    isPublic: {
      type: Boolean,
      default: false,
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

propertySchema.index({ location: "2dsphere" });

propertySchema.index({
  city: 1,
  locality: 1,
  status: 1,
  isPublic: 1,
});

module.exports = mongoose.model("Property", propertySchema);