import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import dbPromise from "../../conn";
import { Session, User } from "../../types";
/**
 * Creates a new session for the given user and sets a cookie with the session ID.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param user - The user object to create the session for.
 * @returns The Express response object.
 */
export const createSession = async (
  req: Request,
  res: Response,
  user: User
): Promise<Response> => {
  const db = await dbPromise;
  const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const session: Session = {
    _id: new ObjectId(),
    userId: user._id,
    expiresAt: sessionExpiresAt,
    userAgent: req.headers["user-agent"] || "",
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
