import faker from "faker";
import bcrypt from "bcryptjs";
import db from "./conn.mjs";

const saltRounds = 10;

async function seed() {
  const usersCollection = await db.collection("users");
  const tasksCollection = await db.collection("tasks");

  await usersCollection.drop();
  await tasksCollection.drop();

  for (let i = 0; i <= 4; i++) {
    const user = !i
      ? {
          email: "demo@user.com",
          pwHash: await bcrypt.hash("password", saltRounds),
        }
      : {
          email: faker.internet.email(),
          pwHash: await bcrypt.hash(`password${i}`, saltRounds),
        };
    const result = await usersCollection.insertOne(user);

    for (let j = 1; j <= 5; j++) {
      const task = {
        title: `${faker.company.bsBuzz()} ${faker.company.bsNoun()}`,
        completed: faker.datatype.boolean(),
        userId: result.insertedId,
      };
      await tasksCollection.insertOne(task);
    }
  }

  console.log("Database seeded!");
}

seed().catch(console.error);
