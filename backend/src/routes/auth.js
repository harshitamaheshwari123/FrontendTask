import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const signupValidator = [
  body("name")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
];

router.post(
  "/signup",
  signupValidator,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );
    res.status(201).json({ token, user: user.toSafeJSON() });
  })
);

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password").isString().withMessage("Password is required"),
];

router.post(
  "/login",
  loginValidator,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );
    res.json({ token, user: user.toSafeJSON() });
  })
);

export default router;
