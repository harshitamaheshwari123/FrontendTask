import { Router } from "express";
import { body, param, query, validationResult } from "express-validator";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/Task.js";

const router = Router();

const createTaskValidator = [
  body("title")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title is required"),
  body("description").optional().isString(),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
  body("dueDate").optional().isISO8601().toDate(),
];

router.get(
  "/",
  requireAuth,
  [
    query("q").optional().isString(),
    query("status").optional().isIn(["todo", "in_progress", "done"]),
  ],
  asyncHandler(async (req, res) => {
    const { q, status } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (q) filter.title = { $regex: q, $options: "i" };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  })
);

router.post(
  "/",
  requireAuth,
  createTaskValidator,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ task });
  })
);

router.put(
  "/:id",
  requireAuth,
  [
    param("id").isMongoId(),
    body("title").optional().isString().trim().isLength({ min: 1 }),
    body("description").optional().isString(),
    body("status").optional().isIn(["todo", "in_progress", "done"]),
    body("dueDate").optional().isISO8601().toDate(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
  })
);

router.delete(
  "/:id",
  requireAuth,
  [param("id").isMongoId()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.status(204).send();
  })
);

export default router;
