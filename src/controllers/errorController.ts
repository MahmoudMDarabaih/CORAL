import { NextFunction, Request, Response } from 'express';
import APIError from '../utils/APIError';
import { ForeignKeyConstraintError } from 'sequelize';
import { fileLogger } from '../loggers/app-logger';

const errorController = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  } else {
    let message;
    let statusCode;
    if (err instanceof ForeignKeyConstraintError){
      message = 'SQL Foreign key constraint error happened';
      statusCode = 400;
    }
    fileLogger.error(`${err.message}`);
    res.status(statusCode || 500).json({
      status: 'error',
      message: message || err.message,
      stack: err.stack,
    });
  }
};

export default errorController;
