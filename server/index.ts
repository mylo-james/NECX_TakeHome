import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import "express-async-errors";
import cookieParser from "cookie-parser";
import users from "./routes/users/index";
import tasks from "./routes/tasks/index";
import auth from "./routes/auth/index";
import "./loadEnv";

const PORT: number | string = process.env.PORT || 5050;
const app: Application = express();

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Load the /users routes
app.use("/users", users);
app.use("/tasks", tasks);
app.use("/auth", auth);

// Global error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
