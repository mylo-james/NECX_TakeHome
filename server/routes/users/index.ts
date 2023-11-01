// index.ts
import express, { Request, Response } from "express";
import { getAllUsers, getUserById, getUserByEmail } from "./dbOperations";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.send(users);
});

router.get("/id/:id", async (req: Request, res: Response) => {
  const user = await getUserById(new ObjectId(req.params.id));
  res.send(user);
});

router.get("/email/:email", async (req: Request, res: Response) => {
  const email: string = decodeURIComponent(req.params.email);
  const user = await getUserByEmail(email);
  res.send(user);
});

export default router;
