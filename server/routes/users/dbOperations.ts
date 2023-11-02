// dbOperations.ts
import { ObjectId } from "mongodb";
import dbPromise from "../../conn";
import { User } from "../../types";
import { getTasksByUserId } from "../tasks/dbOperations";

export const getAllUsers = async (searchTerm: string): Promise<User[]> => {
  const db = await dbPromise;
  const regex = new RegExp(searchTerm, "i"); // 'i' makes it case insensitive
  return (await db
    .collection("users")
    .find({ email: regex }, { projection: { email: 1 } })
    .limit(5)
    .toArray()) as User[];
};
export const getUserById = async (id: ObjectId): Promise<User | null> => {
  const db = await dbPromise;
  const user = (await db
    .collection("users")
    .findOne({ _id: id })) as User | null;
  const tasks = await getTasksByUserId(id);
  user!.tasks = tasks;
  return user;
};

export const getUserByEmail = async (
  email: string
): Promise<Partial<User> | null> => {
  const db = await dbPromise;
  const user = (await db.collection("users").findOne({ email })) as User | null;
  const tasks = await getTasksByUserId(user!._id);

  return { email: user!.email, tasks: tasks };
};
