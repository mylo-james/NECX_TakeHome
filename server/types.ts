import { WithId, Document, ObjectId } from "mongodb";

export interface Session extends WithId<Document> {
  userId: ObjectId;
  expiresAt: Date;
  userAgent: string;
}

export interface User extends WithId<Document> {
  _id: ObjectId;
  email: string;
  pwHash: string;
}

export interface Task extends WithId<Document> {
  userId: ObjectId;
  title: string;
  completed: boolean;
}
