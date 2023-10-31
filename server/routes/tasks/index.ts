import express, { Request, Response } from "express";
import { Collection, ObjectId, ReturnDocument } from "mongodb";
import dbPromise from "../../conn";
import { Task, User } from "../../types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const tasks: Task[] = (await db
    .collection("tasks")
    .find()
    .toArray()) as Task[];
  res.send(tasks);
});

router.get("/userId/:userId", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const tasks: Task[] = (await db
    .collection("tasks")
    .find({ userId: req.params.userId })
    .toArray()) as Task[];
  res.send(tasks);
});

router.post("/userIds", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const tasks: Task[] = (await db
    .collection("tasks")
    .find({ userId: { $in: req.body.userIds } })
    .toArray()) as Task[];
  res.send(tasks);
});

router.get("/email/:email", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const email: string = decodeURIComponent(req.params.email);
  const user: User | null = (await db
    .collection("users")
    .findOne({ email: email })) as User | null;

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  const tasks: Task[] = (await db
    .collection("tasks")
    .find({ userId: user._id })
    .toArray()) as Task[];
  res.send(tasks);
});

router.post("/emails", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const emails: string[] = req.body.emails.map((email: string) =>
    decodeURIComponent(email)
  );
  const users = await db
    .collection("users")
    .find({ email: { $in: emails } })
    .toArray();
  const userIds: ObjectId[] = users.map((user) => user._id);
  const tasks: Task[] = (await db
    .collection("tasks")
    .find({ userId: { $in: userIds } })
    .toArray()) as Task[];
  res.send(tasks);
});

// Create a task
router.post("/", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const newTask: Task = req.body;
  const result = await db.collection("tasks").insertOne(newTask);
  res.send((result as any).ops[0]);
});

// Edit a task
router.put("/:taskId", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const updatedTask: Task = req.body;
  const result = await db
    .collection("tasks")
    .findOneAndUpdate(
      { _id: req.params.taskId },
      { $set: updatedTask },
      { returnDocument: ReturnDocument.AFTER }
    );
  res.send(result.value);
});

// Delete a task
router.delete("/:taskId", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const result = await db
    .collection("tasks")
    .deleteOne({ _id: req.params.taskId });
  res.send(result);
});

export default router;
