import express from "express";
import cors from "cors";
import "express-async-errors";
import users from "./routes/users/index.mjs";
import tasks from "./routes/tasks/index.mjs";
import auth from "./routes/auth/index.mjs";
import "./loadEnv.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Load the /users routes
app.use("/users", users);
app.use("/tasks", tasks);
app.use("/auth", auth);

// Global error handling
app.use((err, _req, res, next) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
