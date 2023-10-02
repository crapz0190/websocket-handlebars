import dotenv from "dotenv";
import dirname from "./utils.js";
import { join } from "node:path";

dotenv.config({
  path: join(dirname, "/production.env"),
});

const configEnv = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,
};

console.log(`NODE_ENV = ${configEnv.NODE_ENV}`);

export default configEnv;
