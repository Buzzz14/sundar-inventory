import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/userModel.js";

async function run() {
  try {
    const email = process.env.SEED_SUPERADMIN_EMAIL;
    const password = process.env.SEED_SUPERADMIN_PASSWORD;
    const name = process.env.SEED_SUPERADMIN_NAME || "Super Admin";

    if (!email || !password) {
      console.error("SEED_SUPERADMIN_EMAIL and SEED_SUPERADMIN_PASSWORD are required");
      process.exit(1);
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== "superadmin") {
        existing.role = "superadmin";
        await existing.save();
        console.log(`Updated existing user to superadmin: ${email}`);
      } else {
        console.log(`Superadmin already exists: ${email}`);
      }
      process.exit(0);
    }

    const user = await User.create({ email, password, name, role: "superadmin" });
    console.log(`Superadmin created: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed superadmin:", err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

run();






