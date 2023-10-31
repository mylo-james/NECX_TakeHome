import express from "express";
import bcrypt from "bcryptjs";
import db from "../../conn.mjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Create session
  const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const session = {
    userId: user._id,
    expiresAt: sessionExpiresAt,
    userAgent: req.headers["user-agent"],
  };
  const result = await db.collection("sessions").insertOne(session);
  const sessionId = result.insertedId;
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  return res.json({ message: "Logged in", user: user });
});

router.post("/check-session", async (req, res) => {
  const sessionId = req?.cookies?.sessionId;

  // Check if session exists
  const session = await db.collection("sessions").findOne({ _id: sessionId });
  if (!session) {
    return res.status(401).json({ message: "Invalid session ID" });
  }

  // Check if session is expired
  if (
    session.expiresAt < new Date() ||
    session.userAgent !== req.headers["user-agent"]
  ) {
    await db.collection("sessions").deleteOne({ _id: sessionId });
    return res.status(401).json({ message: "Session expired" });
  }

  // Refresh session expiresAt
  const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  await db
    .collection("sessions")
    .updateOne({ _id: sessionId }, { $set: { expiresAt: sessionExpiresAt } });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  const user = await db.collection("users").findOne({ _id: session.userId });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const tasks =
    (await db.collection("tasks").find({ userId: session.userId }).toArray()) ||
    [];

  return res.json({ message: "Session valid", user: user, tasks: tasks });
});

export default router;
