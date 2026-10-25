import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token)
      return res.status(401).json({ message: "Please log in to continue." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("authorId");
    if (!user)
      return res
        .status(401)
        .json({ message: "This account no longer exists." });
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Your session is invalid or expired. Please log in again.",
      });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin access is required." });
  next();
};

export const authorOnly = (req, res, next) => {
  if (req.user?.role !== "author")
    return res.status(403).json({ message: "Author access is required." });
  next();
};
