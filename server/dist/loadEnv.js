"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`,
});
console.log(process.env.DB_URI);
