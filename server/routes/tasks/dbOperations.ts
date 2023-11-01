import { Collection, InsertOneResult, ObjectId, ReturnDocument } from "mongodb";
import dbPromise from "../../conn";
import { Task, User } from "../../types";

/**
 * Returns the tasks collection from the database.
 * @returns A Promise that resolves to the tasks collection.
 */
export const getTasksCollection = async (): Promise<Collection<Task>> => {
  const db = await dbPromise;
  return db.collection("tasks");
};

/**
 * Returns the users collection from the database.
 * @returns A Promise that resolves to the users collection.
 */
export const getUserCollection = async (): Promise<Collection<User>> => {
  const db = await dbPromise;
  return db.collection("users");
};

/**
 * Returns an array of tasks that belong to the specified user.
 * @param userId The ID of the user to retrieve tasks for.
 * @returns A Promise that resolves to an array of tasks.
 */
export const getTasksByUserId = async (userId: ObjectId): Promise<Task[]> => {
  const tasksCollection = await getTasksCollection();
  return tasksCollection.find({ userId }).toArray();
};

/**
 * Returns the user with the specified email address.
 * @param email The email address of the user to retrieve.
 * @returns A Promise that resolves to the user, or null if no user was found.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const userCollection = await getUserCollection();
  return userCollection.findOne({ email }) as Promise<User | null>;
};

/**
 * Creates a new task in the database.
 * @param task The task to create.
 * @returns A Promise that resolves to the newly created task.
 */
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const tasksCollection = await getTasksCollection();
  const user = task.user as User;
  const newTask: Task = {
    _id: new ObjectId(),
    title: task.title!,
    completed: false,
    userId: new ObjectId(user._id),
  };
  const result: InsertOneResult<Task> = await tasksCollection.insertOne(
    newTask
  );
  const insertedId = result.insertedId;
  return tasksCollection.findOne({ _id: insertedId }) as Promise<Task>;
};

/**
 * Updates an existing task in the database.
 * @param taskId The ID of the task to update.
 * @param task The new values for the task.
 * @returns A Promise that resolves to the updated task.
 * @throws An error if no task was found with the specified ID.
 */
export const updateTask = async (
  taskId: string,
  task: Partial<Task>
): Promise<Task> => {
  const tasksCollection = await getTasksCollection();
  const { value: updatedTask } = await tasksCollection.findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    { $set: { title: task.title, completed: task.completed } },
    { returnDocument: ReturnDocument.AFTER }
  );
  if (!updatedTask) {
    throw new Error(`Task with id ${taskId} not found`);
  }
  return updatedTask as Task;
};

/**
 * Deletes a task from the database.
 * @param taskId The ID of the task to delete.
 * @returns A Promise that resolves when the task has been deleted.
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const tasksCollection = await getTasksCollection();
  await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
};
