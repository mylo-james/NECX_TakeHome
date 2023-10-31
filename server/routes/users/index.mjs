import express from "express";
import db from "../../conn.mjs";

const router = express.Router();

router.get("/", async (_req, res) => {
  const collection = await db.collection("users").find({}).toArray();
  res.send(collection);
});

router.get("/id/:id", async (req, res) => {
  const collection = await db
    .collection("users")
    .findOne({ _id: req.params.id });
  res.send(collection);
});

router.get("/email/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  const collection = await db.collection("users").findOne({ email: email });
  res.send(collection);
});

export default router;
