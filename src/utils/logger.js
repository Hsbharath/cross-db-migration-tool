import pino from "pino";
import chalk from "chalk";

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
});

const logger = {
  info: (msg, data = {}) => {
    pinoLogger.info(data, chalk.cyan(msg));
  },
  warn: (msg, data = {}) => {
    pinoLogger.warn(data, chalk.yellow(msg));
  },
  error: (msg, data = {}) => {
    pinoLogger.error(data, chalk.red(msg));
  },
  success: (msg, data = {}) => {
    pinoLogger.info(data, chalk.green(msg));
  },
  debug: (msg, data = {}) => {
    pinoLogger.debug(data, chalk.gray(msg));
  },
};

export default logger;
