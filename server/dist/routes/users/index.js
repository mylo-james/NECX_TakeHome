"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const conn_1 = __importDefault(require("../../conn"));
const router = express_1.default.Router();
router.get("/", async (_req, res) => {
    const db = await conn_1.default;
    const users = (await db
        .collection("users")
        .find({})
        .toArray());
    res.send(users);
});
router.get("/id/:id", async (req, res) => {
    const db = await conn_1.default;
    const user = (await db
        .collection("users")
        .findOne({ _id: new mongodb_1.ObjectId(req.params.id) }));
    res.send(user);
});
router.get("/email/:email", async (req, res) => {
    const db = await conn_1.default;
    const email = decodeURIComponent(req.params.email);
    const user = (await db
        .collection("users")
        .findOne({ email: email }));
    res.send(user);
});
exports.default = router;
