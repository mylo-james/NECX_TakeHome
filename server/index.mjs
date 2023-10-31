import express from "express";
import cors from "cors";
import "express-async-errors";
import users from "./routes/users/index.mjs";
import tasks from "./routes/tasks/index.mjs";
import "./db/loadEnv.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /users routes
app.use("/users", users);
app.use("/tasks", tasks);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
