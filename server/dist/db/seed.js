"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const conn_mjs_1 = __importDefault(require("../conn.mjs"));
const saltRounds = 10;
async function seed() {
    const usersCollection = await conn_mjs_1.default.collection("users");
    const tasksCollection = await conn_mjs_1.default.collection("tasks");
    await usersCollection.drop();
    await tasksCollection.drop();
    for (let i = 0; i <= 4; i++) {
        const user = !i
            ? {
                email: "demo@user.com",
                pwHash: await bcryptjs_1.default.hash("password", saltRounds),
            }
            : {
                email: faker_1.default.internet.email(),
                pwHash: await bcryptjs_1.default.hash(`password${i}`, saltRounds),
            };
        const result = await usersCollection.insertOne(user);
        for (let j = 1; j <= 5; j++) {
            const task = {
                title: `${faker_1.default.company.bsBuzz()} ${faker_1.default.company.bsNoun()}`,
                completed: faker_1.default.datatype.boolean(),
                userId: result.insertedId,
            };
            await tasksCollection.insertOne(task);
        }
    }
    console.log("Database seeded!");
    process.exit();
}
seed().catch(console.error);
