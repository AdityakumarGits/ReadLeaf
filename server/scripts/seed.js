import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Author from "../models/Author.js";
import User from "../models/User.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const sampleData = JSON.parse(fs.readFileSync(path.join(currentDir, "../data/bookleaf_sample_data.json"), "utf8"));

const seed = async () => {
  try {
    await connectDB();
    await Author.deleteMany({});
    await User.deleteMany({});
    const password = await bcrypt.hash("Author@123", 10);
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const createdAuthors = await Author.insertMany(sampleData.authors);
    const users = createdAuthors.map((author) => ({
      name: author.name,
      email: author.email,
      password,
      role: "author",
      authorId: author._id
    }));
    users.push({
      name: "BookLeaf Admin",
      email: "admin@bookleaf.com",
      password: adminPassword,
      role: "admin",
      authorId: null
    });
    await User.insertMany(users);
    console.log(`Seed complete: ${createdAuthors.length} authors and ${sampleData.authors.reduce((sum, a) => sum + a.books.length, 0)} books.`);
    console.log("Admin: admin@bookleaf.com / Admin@123");
    console.log("Sample author: priya.sharma@email.com / Author@123");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};
seed();
