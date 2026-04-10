import mongoose from "mongoose";
import chalk from "chalk";

/**
 * CUSTOM TERMINAL THEME
 */
const theme = {
  error: chalk.bold.white.bgRed,
  msg: chalk.red,
  label: chalk.bold.cyan,
  value: chalk.whiteBright,
  border: chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
};

export const connectDB = async (): Promise<void> => {
  try {
    const { MONGO_URI, DB_NAME, NODE_ENV } = process.env;

    console.log("uri", MONGO_URI);
    console.log("db", DB_NAME);
    console.log("node ", NODE_ENV);

    // 1. Validation Logic
    if (!MONGO_URI || !DB_NAME) {
      console.log(`\n${theme.error(" CONFIG ERROR ")} Environment variables missing.`);
      process.exit(1);
    }

    // 2. Connection Attempt
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });

    // 3. Success UI
    console.log(`\n${theme.border}`);
    console.log(`${chalk.bgGreen.black.bold(" DATABASE CONNECTED ")}`);
    console.log(`${theme.label("HOST: ")} ${theme.value(conn.connection.host)}`);
    console.log(`${theme.label("NAME: ")} ${theme.value(DB_NAME)}`);
    console.log(`${theme.label("MODE: ")} ${theme.value(NODE_ENV || "development")}`);
    console.log(`${theme.border}\n`);

  } catch (error: any) {
    // 4. Advanced Professional Error UI
    console.log(`\n${theme.border}`);
    console.log(`${theme.error(" DATABASE CRITICAL FAILURE ")}`);
    console.log(`${theme.label("TIMESTAMP: ")} ${theme.value(new Date().toISOString())}`);
    console.log(`${theme.label("MESSAGE:   ")} ${theme.msg(error.message)}`);

    // Agar development mode hai toh pura stack dikhao
    if (process.env.NODE_ENV === "development") {
      console.log(`\n${theme.label("STACK TRACE:")}`);
      console.log(chalk.gray(error.stack));
    }

    console.log(`${theme.border}\n`);
    
    // Server ko immediate shut down karein kyunki DB ke bina app useless hai
    process.exit(1);
  }
};

/**
 * RUNTIME ERROR MONITORING
 */
mongoose.connection.on("error", (err) => {
  console.log(`${theme.error(" RUNTIME ERROR ")} ${theme.msg(err.message)}`);
});

mongoose.connection.on("disconnected", () => {
  console.log(`\n${chalk.bgYellow.black.bold(" DISCONNECTED ")} ${chalk.yellow("Re-establishing connection...")}`);
});