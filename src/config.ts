import * as dotenv from "dotenv";
import errors from "./resources/enums/errors.json";

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === "test";

 


export default {
  errors,
  name: process.env.npm_package_name,
  version: process.env.npm_package_version,
  appUrl: process.env.APP_URL,
  environment: process.env.NODE_ENV || "development",
  port: isTestEnvironment
    ? process.env.TEST_APP_PORT || 80
    : process.env.APP_PORT || 80,
  pagination: {
    page: 1,
    maxRows: 20,
  },
  logging: {
    dir: process.env.LOGGING_DIR || "logs",
    level: process.env.LOGGING_LEVEL || "info",
    maxSize: process.env.LOGGING_MAX_SIZE || "20m",
    maxFiles: process.env.LOGGING_MAX_FILES || "7d",
    datePattern: process.env.LOGGING_DATE_PATTERN || "YYYY-MM-DD",
  },
};
