import { magenta } from 'colorette';
import { logger, fileLogger } from '../loggers/database-logger';

const dbLogger = (message: string): void => {
  // to colorize the logs of the database to differentiate them from the rest of the logs
  logger.info(magenta(`[Sequelize]: ${message}`));
  fileLogger.info(`[Sequelize]: ${message}`);
};

export default dbLogger;
