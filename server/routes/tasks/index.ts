import express from "express";
import {
  handleGetTasksByEmail,
  handleGetTasksByUserId,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} from "./routeHandlers";

/**
 * Express router for handling task-related requests.
 */
const router = express.Router();

/**
 * GET request handler for retrieving tasks by user ID.
 * @param userId - The ID of the user whose tasks to retrieve.
 */
router.get("/userId/:userId", handleGetTasksByUserId);

/**
 * GET request handler for retrieving tasks by email.
 * @param email - The email of the user whose tasks to retrieve.
 */
router.get("/email/:email", handleGetTasksByEmail);

/**
 * POST request handler for creating a new task.
 */
router.post("/", handleCreateTask);

/**
 * PUT request handler for updating an existing task.
 * @param taskId - The ID of the task to update.
 */
router.put("/:taskId", handleUpdateTask);

/**
 * DELETE request handler for deleting an existing task.
 * @param taskId - The ID of the task to delete.
 */
router.delete("/:taskId", handleDeleteTask);

export default router;
