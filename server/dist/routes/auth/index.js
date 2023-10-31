"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const conn_1 = __importDefault(require("../../conn"));
const mongodb_1 = require("mongodb");
const utils_1 = require("./utils");
const router = express_1.default.Router();
/**
 * Handles the login request.
 */
router.post("/login", async (req, res) => {
    const db = await conn_1.default;
    const { email, password } = req.body;
    console.log(email, password);
    // Check if user exists
    const user = await db.collection("users").findOne({ email });
    console.log(user);
    if (!user) {
        return res.status(401).json({ message: "Invalid email" });
    }
    // Check if password is correct
    const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.pwHash);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
    }
    // Create session
    const sessionRes = await (0, utils_1.createSession)(req, res, user);
    const tasks = await db
        .collection("tasks")
        .find({ userId: user._id })
        .toArray();
    return sessionRes.json({ message: "Logged in", user: user, tasks: tasks });
});
/**
 * Handles the registration request.
 */
router.post("/register", async (req, res) => {
    const db = await conn_1.default;
    const { email, password } = req.body;
    console.log(email, password);
    // Check if the user already exists
    const existingUser = await db
        .collection("users")
        .findOne({ email });
    console.log(existingUser);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create the new user
    const user = {
        email,
        pwHash: hashedPassword,
        _id: new mongodb_1.ObjectId(),
    };
    await db.collection("users").insertOne(user);
    const sessionRes = await (0, utils_1.createSession)(req, res, user);
    return sessionRes
        .status(201)
        .json({ message: "User created", user, tasks: [] });
});
/**
 * Handles the session check request.
 */
router.post("/check-session", async (req, res) => {
    const db = await conn_1.default;
    const sessionId = req?.cookies?.sessionId;
    // Check if session exists
    const session = await db
        .collection("sessions")
        .findOne({ _id: new mongodb_1.ObjectId(sessionId) });
    console.log(session);
    if (!session) {
        return res.status(401).json({ message: "Invalid session ID" });
    }
    // Check if session is expired
    if (session.expiresAt < new Date() ||
        session.userAgent !== req.headers["user-agent"]) {
        await db.collection("sessions").deleteOne({ _id: new mongodb_1.ObjectId(sessionId) });
        return res.status(401).json({ message: "Session expired" });
    }
    // Refresh session expiresAt
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    await db
        .collection("sessions")
        .updateOne({ _id: new mongodb_1.ObjectId(sessionId) }, { $set: { expiresAt: sessionExpiresAt } });
    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    const user = await db
        .collection("users")
        .findOne({ _id: session.userId });
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const tasks = (await db.collection("tasks").find({ userId: session.userId }).toArray()) ||
        [];
    return res.json({ message: "Session valid", user: user, tasks: tasks });
});
/**
 * Handles the signout request.
 */
router.post("/signout", async (req, res) => {
    const db = await conn_1.default;
    const sessionId = req?.cookies?.sessionId;
    res.clearCookie("sessionId");
    if (!sessionId) {
        return res.status(401).json({ message: "No session ID found, signed out" });
    }
    await db.collection("sessions").deleteOne({ _id: new mongodb_1.ObjectId(sessionId) });
    return res.json({ message: "Signed out successfully" });
});
exports.default = router;
