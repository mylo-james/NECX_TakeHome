import "./loadEnv";
import { MongoClient } from "mongodb";

const connectionString: string = process.env.DB_URI || "none";
const client: MongoClient = new MongoClient(connectionString);

export default client.connect().then(connection => connection.db("todo"));
