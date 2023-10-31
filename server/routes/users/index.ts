import express, { Request, Response } from "express";
import { Collection, ObjectId } from "mongodb";
import dbPromise from "../../conn";
import { User } from "../../types";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const db = await dbPromise;
  const users: User[] = (await db
    .collection("users")
    .find({})
    .toArray()) as User[];
  res.send(users);
});

router.get("/id/:id", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const user: User | null = (await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.params.id) })) as User | null;
  res.send(user);
});

router.get("/email/:email", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const email: string = decodeURIComponent(req.params.email);
  const user: User | null = (await db
    .collection("users")
    .findOne({ email: email })) as User | null;
  res.send(user);
});

export default router;
