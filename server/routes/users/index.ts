// index.ts
import express, { Request, Response } from "express";
import { getAllUsers, getUserById, getUserByEmail } from "./dbOperations";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const searchTerm = String(req.query.searchTerm) || "";
  const users = await getAllUsers(searchTerm);
  if (users.length === 0) {
    res.status(404).json({ message: "No Users Found", users: [] });
  } else {
    res.json({ message: "Users Found", users });
  }
});

router.get("/id/:id", async (req: Request, res: Response) => {
  const user = await getUserById(new ObjectId(req.params.id));
  res.send(user);
});

router.get("/email/:email", async (req: Request, res: Response) => {
  const email: string = decodeURIComponent(req.params.email);
  const user = await getUserByEmail(email);
  res.json({ message: "User Found", user });
});

export default router;
