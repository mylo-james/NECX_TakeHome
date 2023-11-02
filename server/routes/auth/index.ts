import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dbPromise from "../../conn";
import { ObjectId } from "mongodb";
import { createSession } from "./utils";
import { Session, User } from "../../types";

const router = express.Router();

/**
 * Handles the login request.
 */
router.post("/login", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const { email, password } = req.body as { email: string; password: string };

  // Check if user exists
  const user: User | null = (await db
    .collection("users")
    .findOne({ email })) as User | null;
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.pwHash);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Create session
  const sessionRes = await createSession(req, res, user);
  const tasks = await db
    .collection("tasks")
    .find({ userId: user._id })
    .toArray();

  return sessionRes.json({ message: "Logged in", user: user, tasks: tasks });
});

/**
 * Handles the registration request.
 */
router.post("/register", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const { email, password } = req.body as { email: string; password: string };

  // Check if the user already exists
  const existingUser: User | null = (await db
    .collection("users")
    .findOne({ email })) as User | null;
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  const user: User = {
    email,
    pwHash: hashedPassword,
    _id: new ObjectId(),
  };
  await db.collection("users").insertOne(user);
  const sessionRes = await createSession(req, res, user);

  return sessionRes
    .status(201)
    .json({ message: "User created", user, tasks: [] });
});

/**
 * Handles the session check request.
 */
router.post("/check-session", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const sessionId = req?.cookies?.sessionId;
  // Check if session exists
  const session: Session | null = (await db
    .collection("sessions")
    .findOne({ _id: new ObjectId(sessionId) })) as Session | null;
  if (!session) {
    return res.status(401).json({ message: "Please Login or Register" });
  }

  // Check if session is expired
  if (
    session.expiresAt < new Date() ||
    session.userAgent !== req.headers["user-agent"]
  ) {
    await db.collection("sessions").deleteOne({ _id: new ObjectId(sessionId) });
    return res.status(401).json({ message: "Please Login or Register" });
  }

  // Refresh session expiresAt
  const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  await db
    .collection("sessions")
    .updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { expiresAt: sessionExpiresAt } }
    );

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  const user: User | null = (await db
    .collection("users")
    .findOne({ _id: session.userId })) as User | null;
  if (!user) {
    return res.status(401).json({ message: "Error: Please Try Again Later" });
  }
  const tasks =
    (await db.collection("tasks").find({ userId: session.userId }).toArray()) ||
    [];

  return res.json({ message: "Logged In", user: user, tasks: tasks });
});

/**
 * Handles the signout request.
 */
router.post("/signout", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const sessionId = req?.cookies?.sessionId;
  res.clearCookie("sessionId");
  if (!sessionId) {
    return res.status(401).json({ message: "Signed out successfully" });
  }

  await db.collection("sessions").deleteOne({ _id: new ObjectId(sessionId) });

  return res.json({ message: "Signed out successfully" });
});

export default router;
