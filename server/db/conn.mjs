import { MongoClient } from "mongodb";
import "./loadEnv.mjs";

const connectionString = process.env.DB_URI || "none";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("todo");

export default db;
