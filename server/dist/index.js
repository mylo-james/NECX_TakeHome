"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./routes/users/index"));
const index_2 = __importDefault(require("./routes/tasks/index"));
const index_3 = __importDefault(require("./routes/auth/index"));
require("./loadEnv");
const PORT = process.env.PORT || 5050;
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Load the /users routes
app.use("/users", index_1.default);
app.use("/tasks", index_2.default);
app.use("/auth", index_3.default);
// Global error handling
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).send("Uh oh! An unexpected error occurred.");
});
// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
