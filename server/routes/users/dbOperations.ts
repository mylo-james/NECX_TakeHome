// dbOperations.ts
import { ObjectId } from "mongodb";
import dbPromise from "../../conn";
import { User } from "../../types";

export const getAllUsers = async (): Promise<User[]> => {
  const db = await dbPromise;
  return (await db.collection("users").find({}).toArray()) as User[];
};

export const getUserById = async (id: ObjectId): Promise<User | null> => {
  const db = await dbPromise;
  return (await db.collection("users").findOne({ _id: id })) as User | null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const db = await dbPromise;
  return (await db.collection("users").findOne({ email })) as User | null;
};
