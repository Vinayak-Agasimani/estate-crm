const mongoose = require("mongoose");
const Property = require("../models/Property");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");

/*
|--------------------------------------------------------------------------
| Normalize phone number
|--------------------------------------------------------------------------
| For the Indian MVP:
| 9876543210
| +91 9876543210
| 91-9876543210
|
| will all become:
| 9876543210
|
*/

const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return digits;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(-10);
  }

  return digits;
};

/*
|--------------------------------------------------------------------------
| CREATE PUBLIC PROPERTY ENQUIRY
|--------------------------------------------------------------------------
*/

const createPublicEnquiry = async (req, res) => {
  try {
    const {
      propertyId,
      name,
      phone,
      email,
      message,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Basic validation
    |--------------------------------------------------------------------------
    */

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const normalizedPhone = normalizePhone(phone);

    if (
      normalizedPhone.length < 7 ||
      normalizedPhone.length > 15
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (message && message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check property
    |--------------------------------------------------------------------------
    */

    const property = await Property.findOne({
      _id: propertyId,
      isPublic: true,
      status: "AVAILABLE",
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "This property is no longer available",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find existing customer
    |--------------------------------------------------------------------------
    */

    let customer = await Customer.findOne({
      phone: normalizedPhone,
    });

    /*
    |--------------------------------------------------------------------------
    | Create customer if it doesn't exist
    |--------------------------------------------------------------------------
    */

    if (!customer) {
      customer = await Customer.create({
        name: name.trim(),
        phone: normalizedPhone,
        email: email?.trim() || undefined,
        notes: message?.trim() || "",
        status: "ACTIVE",
      });
    } else {
      /*
      |--------------------------------------------------------------------------
      | Update basic customer information
      |--------------------------------------------------------------------------
      */

      customer.name = name.trim();

      if (email?.trim()) {
        customer.email = email.trim();
      }

      if (message?.trim()) {
        customer.notes = customer.notes
          ? `${customer.notes}\n${message.trim()}`
          : message.trim();
      }

      await customer.save();
    }

    /*
    |--------------------------------------------------------------------------
    | Check if customer already has an open lead
    |--------------------------------------------------------------------------
    */

    let lead = await Lead.findOne({
      customerId: customer._id,
      propertyId: property._id,
      status: {
        $nin: ["WON", "LOST"],
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Create lead
    |--------------------------------------------------------------------------
    */

    if (!lead) {
      lead = await Lead.create({
        customerId: customer._id,
        propertyId: property._id,
        source: "WEBSITE",
        status: "NEW",
        priority: "MEDIUM",
        notes: message?.trim() || "",
      });
    } else if (message?.trim()) {
      /*
      |--------------------------------------------------------------------------
      | Add new enquiry message to existing lead
      |--------------------------------------------------------------------------
      */

      lead.notes = lead.notes
        ? `${lead.notes}\n${message.trim()}`
        : message.trim();

      await lead.save();
    }

    /*
    |--------------------------------------------------------------------------
    | Public response
    |--------------------------------------------------------------------------
    | Do NOT return customer/lead information to the visitor.
    */

    return res.status(201).json({
      success: true,
      message:
        "Your enquiry has been submitted successfully. Our property advisor will contact you soon.",
    });
  } catch (error) {
    console.error("Public enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit enquiry. Please try again later.",
    });
  }
};

module.exports = {
  createPublicEnquiry,
};