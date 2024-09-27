import dotenv from 'dotenv';
// to get local configuration for your system,
// see .env.example to understand what are the required variables.
dotenv.config({ path: './config/.env.local' });
// to get global configuration that should be applied on all systems.
dotenv.config({ path: './config/.env' });

import app from './app';
import sequelize from './database';
import associateModels from './db-files/associations';
import { logger, fileLogger } from './loggers/app-logger';

const PORT: number | undefined = Number(process.env.PORT) || 80;

// Sync database and start server
const startServer = async() => {
  try {
    associateModels();
    await sequelize.sync(); // { force: true } for development only to drop and recreate tables
    logger.info('Database & tables created!');
    fileLogger.info('Database & tables created!');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      fileLogger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start the server:', error);
    fileLogger.error('Unable to start the server:', error);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  fileLogger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // to indicate that some error happened.
});

process.on('uncaughtException', (error) => {
  fileLogger.error('Uncaught Exception:', error);
  process.exit(1); // to indicate that some error happened.
});

startServer();
