const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({
      email: "admin@estatecrm.com",
    });

    if (existingUser) {
      console.log("Admin already exists.");
      process.exit();
    }

    const passwordHash = await bcrypt.hash(
      "Admin@12345",
      12
    );

    await User.create({
      name: "Estate CRM Admin",
      email: "admin@estatecrm.com",
      phone: "9999999999",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    });

    console.log("Admin created successfully.");

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();