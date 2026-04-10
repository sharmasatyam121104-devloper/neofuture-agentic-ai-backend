import dotenv from 'dotenv';
dotenv.config();

import chalk from 'chalk';
import server from './app';
import { connectDB } from './config/db';



const PORT: string | number = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || "development";

const ui = {
  border: chalk.gray("━".repeat(50)),
  star: chalk.yellow("★"),
  tag: (label: string) => chalk.bgWhite.black.bold(` ${label} `),
  value: (text: string | number) => chalk.cyan.bold(text),
};

const startServer = async () => {
  try {
    await connectDB();


    server.listen(PORT, () => {
      console.log(`\n${ui.border}`);
      console.log(`${chalk.bgBlue.white.bold(" SYSTEM STATUS ")} ${chalk.green.bold("ONLINE")}`);
      console.log(`${ui.border}`);
      
      console.log(`${ui.star} ${ui.tag("ENVIRONMENT")} : ${ui.value(ENV.toUpperCase())}`);
      console.log(`${ui.star} ${ui.tag("PORT")       } : ${ui.value(PORT)}`);
      console.log(`${ui.star} ${ui.tag("ENDPOINT")   } : ${chalk.underline.blue(`http://localhost:${PORT}`)}`);
      
      console.log(`${ui.border}\n`);
      
      console.log(chalk.gray.italic("  Waiting for incoming requests...\n"));
    });

  } catch (error) {
    console.log(`\n${chalk.bgRed.white.bold(" BOOTSTRAP ERROR ")}`);
    console.error(chalk.red((error as Error).message));
    process.exit(1);
  }
};

startServer();