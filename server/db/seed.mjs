import faker from "faker";
import bcrypt from "bcryptjs";
import db from "./conn.mjs";

const saltRounds = 10;

async function seed() {
  const usersCollection = await db.collection("users");
  const tasksCollection = await db.collection("tasks");

  await usersCollection.deleteMany({});
  await tasksCollection.deleteMany({});

  for (let i = 0; i <= 4; i++) {
    const user = !i
      ? {
          email: "demo@user.com",
          pwHash: await bcrypt.hash("password", saltRounds),
          tasks: [],
        }
      : {
          email: faker.internet.email(),
          pwHash: await bcrypt.hash(`password${i}`, saltRounds),
          tasks: [],
        };

    for (let j = 1; j <= 5; j++) {
      const task = {
        title: `${faker.company.bsBuzz()} ${faker.company.bsNoun()}`,
        completed: faker.datatype.boolean(),
      };

      // Insert the task and get the inserted ID
      const { insertedId } = await tasksCollection.insertOne(task);

      // Associate the task ID with the user
      user.tasks.push(insertedId);
    }

    // Insert the user with the associated task IDs
    await usersCollection.insertOne(user);
  }

  console.log("Database seeded!");
}

seed().catch(console.error);
