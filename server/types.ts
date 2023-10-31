import { WithId, Document } from "mongodb";

export interface Session extends WithId<Document> {
  _id?: ObjectId;
  userId: ObjectId;
  expiresAt: Date;
  userAgent: string;
}

export interface User extends WithId<Document> {
  _id?: ObjectId;
  email: string;
  pwHash: string;
}

export interface Task extends WithId<Document> {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  completed: boolean;
}
