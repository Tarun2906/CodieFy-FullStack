import express from "express";
import jwt from "jsonwebtoken";
import History from "../models/History.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const history = await History.find({ user: decoded.id }).sort({ createdAt: -1 });

    res.json(history);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
