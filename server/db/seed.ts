import faker from "faker";
import bcrypt from "bcryptjs";
import db from "../conn.mjs";
import { Collection, ObjectId } from "mongodb";

interface User {
  _id?: ObjectId;
  email: string;
  pwHash: string;
}

interface Task {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  userId: ObjectId;
}

const saltRounds = 10;

async function seed() {
  const usersCollection: Collection<User> = await db.collection("users");
  const tasksCollection: Collection<Task> = await db.collection("tasks");

  await usersCollection.drop();
  await tasksCollection.drop();

  for (let i: number = 0; i <= 4; i++) {
    const user: User = !i
      ? {
          email: "demo@user.com",
          pwHash: await bcrypt.hash("password", saltRounds),
        }
      : {
          email: faker.internet.email(),
          pwHash: await bcrypt.hash(`password${i}`, saltRounds),
        };
    const result = await usersCollection.insertOne(user);

    for (let j: number = 1; j <= 5; j++) {
      const task: Task = {
        title: `${faker.company.bsBuzz()} ${faker.company.bsNoun()}`,
        completed: faker.datatype.boolean(),
        userId: result.insertedId,
      };
      await tasksCollection.insertOne(task);
    }
  }

  console.log("Database seeded!");
  process.exit();
}

seed().catch(console.error);

