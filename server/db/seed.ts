import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import dbPromise from "../conn";
import { Collection, ObjectId } from "mongodb";
import { Task, User } from "../types";

const saltRounds = 10;

async function seed() {
  const db = await dbPromise;
  const usersCollection: Collection<User> = await db.collection("users");
  const tasksCollection: Collection<Task> = await db.collection("tasks");

  await usersCollection.drop();
  await tasksCollection.drop();

  for (let i: number = 0; i <= 4; i++) {
    const user: User = {
      _id: new ObjectId(),
      email: i === 0 ? "demo@user.com" : faker.internet.email(),
      pwHash: await bcrypt.hash(`password${i}`, saltRounds),
    };

    const result = await usersCollection.insertOne(user);

    const insertedUserId = result.insertedId;

    for (let j: number = 1; j <= 5; j++) {
      const task: Task = {
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
