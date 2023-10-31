"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./loadEnv");
const mongodb_1 = require("mongodb");
const connectionString = process.env.DB_URI || "none";
const client = new mongodb_1.MongoClient(connectionString);
exports.default = client.connect().then(connection => connection.db("todo"));
