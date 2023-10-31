import express from "express";
import db from "../../conn.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
  const collection = await db.collection("tasks").find().toArray();
  res.send(collection);
});

router.get("/userId/:userId", async (req, res) => {
  const collection = await db
    .collection("tasks")
    .find({ userId: req.params.userId })
    .toArray();
  res.send(collection);
});

router.post("/userIds", async (req, res) => {
  const collection = await db
    .collection("tasks")
    .find({ userId: { $in: req.body.userIds } })
    .toArray();
  res.send(collection);
});

router.get("/email/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const user = await db.collection("users").findOne({ email: email });
  const collection = await db
    .collection("tasks")
    .find({ userId: user._id })
    .toArray();
  res.send(collection);
});

router.post("/emails", async (req, res) => {
  const emails = req.body.emails.map((email) => decodeURIComponent(email));
  const users = await db
    .collection("users")
    .find({ email: { $in: emails } })
    .toArray();
  const userIds = users.map((user) => user._id);
  const collection = await db
    .collection("tasks")
    .find({ userId: { $in: userIds } })
    .toArray();
  res.send(collection);
});

// Create a task
router.post("/", async (req, res) => {
  const newTask = req.body;
  const result = await db.collection("tasks").insertOne(newTask);
  res.send(result.ops[0]);
});

// Edit a task
router.put("/:taskId", async (req, res) => {
  const updatedTask = req.body;
  const result = await db
    .collection("tasks")
    .findOneAndUpdate(
      { _id: req.params.taskId },
      { $set: updatedTask },
      { returnOriginal: false }
    );
  res.send(result.value);
});

// Delete a task
router.delete("/:taskId", async (req, res) => {
  const result = await db
    .collection("tasks")
    .deleteOne({ _id: req.params.taskId });
  res.send(result);
});

export default router;
