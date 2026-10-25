import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Author from "../models/Author.js";

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  authorId: user.authorId?._id || user.authorId || null,
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must contain at least 8 characters." });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({
        message: "An account with this email already exists. Please log in.",
      });
    }
    let author = await Author.findOne({ email: normalizedEmail });
    if (!author)
      author = await Author.create({
        name: name.trim(),
        email: normalizedEmail,
        books: [],
      });
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role: "author",
      authorId: author._id,
    });
    const populated = await User.findById(user._id).populate("authorId");
    res
      .status(201)
      .json({ token: createToken(user), user: safeUser(populated) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select("+password")
      .populate("authorId");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    res.json({ token: createToken(user), user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res) => res.json({ user: safeUser(req.user) });
