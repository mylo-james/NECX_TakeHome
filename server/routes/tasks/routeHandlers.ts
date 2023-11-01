import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import {
  getTasksByUserId,
  getUserByEmail,
  createTask,
  updateTask,
  deleteTask,
} from "./dbOperations";

/**
 * Handles GET requests for tasks by user ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the tasks found for the given user ID.
 */
export const handleGetTasksByUserId = async (req: Request, res: Response) => {
  const tasks = await getTasksByUserId(new ObjectId(req.params.userId));
  res.json({ message: "Tasks Found", tasks });
};

/**
 * Handles GET requests for tasks by email.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the tasks found for the given email.
 */
export const handleGetTasksByEmail = async (req: Request, res: Response) => {
  const email = decodeURIComponent(req.params.email);
  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const tasks = await getTasksByUserId(user._id);
  res.json({ message: "Tasks Found", tasks });
};

/**
 * Handles POST requests to create a new task.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the newly created task.
 */
export const handleCreateTask = async (req: Request, res: Response) => {
  const createdTask = await createTask(req.body);
  res.json({ message: "Task created", task: createdTask });
};

/**
 * Handles PUT requests to update an existing task.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with the updated task.
 */
export const handleUpdateTask = async (req: Request, res: Response) => {
  const updatedTask = await updateTask(req.params.taskId, req.body);
  res.json({ message: "Task updated", task: updatedTask });
};

/**
 * Handles DELETE requests to delete an existing task.
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating that the task has been deleted.
 */
export const handleDeleteTask = async (req: Request, res: Response) => {
  await deleteTask(req.params.taskId);
  res.json({ message: "Task deleted" });
};
