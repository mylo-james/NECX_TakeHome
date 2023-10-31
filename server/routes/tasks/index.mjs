import express from "express";
import db from "../../db/conn.mjs";
const router = express.Router();

router.get("/", async (_req, res) => {
  const collection = await db.collection("tasks").find({}).toArray();
  res.send(collection);
});

export default router;
