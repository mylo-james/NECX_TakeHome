import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { ObjectId, MongoClient } from "mongodb";

const connectionString = process.env.DB_URI || "mongodb://localhost:27017";
const client = new MongoClient(connectionString);

const saltRounds = 10;

const numberOfUsers = 40;
const numberOfTasksPerUser = 10;

async function seed() {
  const db = await client.connect().then((connection) => connection.db("todo"));
  const usersCollection = await db.collection("users");
  const tasksCollection = await db.collection("tasks");
  const sessionCollection = await db.collection("sessions");

  await usersCollection.drop();
  await tasksCollection.drop();
  await sessionCollection.drop();

  for (let i = 0; i <= numberOfUsers; i++) {
    const user = {
      _id: new ObjectId(),
      email: i === 0 ? "demo@user.com" : faker.internet.email(),
      pwHash: await bcrypt.hash(`Password#${i}`, saltRounds),
    };

    const result = await usersCollection.insertOne(user);

    const insertedUserId = result.insertedId;

    for (let j = 1; j <= numberOfTasksPerUser; j++) {
      const task = {
        _id: new ObjectId(),
        title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
        completed: faker.datatype.boolean(),
        userId: new ObjectId(insertedUserId),
      };
      await tasksCollection.insertOne(task);
    }
  }

  console.log("Database seeded!");
  process.exit();
}

seed().catch(console.error);
