"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = void 0;
const conn_1 = __importDefault(require("../../conn"));
/**
 * Creates a new session for the given user and sets a cookie with the session ID.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param user - The user object to create the session for.
 * @returns The Express response object.
 */
const createSession = async (req, res, user) => {
    const db = await conn_1.default;
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
    return res;
};
exports.createSession = createSession;
