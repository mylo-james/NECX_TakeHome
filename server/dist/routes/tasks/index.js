"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const conn_1 = __importDefault(require("../../conn"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const db = await conn_1.default;
    const tasks = (await db
        .collection("tasks")
        .find()
        .toArray());
    res.send(tasks);
});
router.get("/userId/:userId", async (req, res) => {
    const db = await conn_1.default;
    const tasks = (await db
        .collection("tasks")
        .find({ userId: req.params.userId })
        .toArray());
    res.send(tasks);
});
router.post("/userIds", async (req, res) => {
    const db = await conn_1.default;
    const tasks = (await db
        .collection("tasks")
        .find({ userId: { $in: req.body.userIds } })
        .toArray());
    res.send(tasks);
});
router.get("/email/:email", async (req, res) => {
    const db = await conn_1.default;
    const email = decodeURIComponent(req.params.email);
    const user = (await db
        .collection("users")
        .findOne({ email: email }));
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    const tasks = (await db
        .collection("tasks")
        .find({ userId: user._id })
        .toArray());
    res.send(tasks);
});
router.post("/emails", async (req, res) => {
    const db = await conn_1.default;
    const emails = req.body.emails.map((email) => decodeURIComponent(email));
    const users = await db
        .collection("users")
        .find({ email: { $in: emails } })
        .toArray();
    const userIds = users.map((user) => user._id);
    const tasks = (await db
        .collection("tasks")
        .find({ userId: { $in: userIds } })
        .toArray());
    res.send(tasks);
});
// Create a task
router.post("/", async (req, res) => {
    const db = await conn_1.default;
    const newTask = req.body;
    const result = await db.collection("tasks").insertOne(newTask);
    res.send(result.ops[0]);
});
// Edit a task
router.put("/:taskId", async (req, res) => {
    const db = await conn_1.default;
    const updatedTask = req.body;
    const result = await db
        .collection("tasks")
        .findOneAndUpdate({ _id: req.params.taskId }, { $set: updatedTask }, { returnDocument: mongodb_1.ReturnDocument.AFTER });
    res.send(result.value);
});
// Delete a task
router.delete("/:taskId", async (req, res) => {
    const db = await conn_1.default;
    const result = await db
        .collection("tasks")
        .deleteOne({ _id: req.params.taskId });
    res.send(result);
});
exports.default = router;
