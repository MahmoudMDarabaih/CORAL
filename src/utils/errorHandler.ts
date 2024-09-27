import { NextFunction, Request, Response } from 'express';
import { AsyncRequestHandler } from '../utils/functions/AsyncRequestHandler';
// to wrap controllers calls in a call that has a catch nested to it
// so errors will be moved to the global error handler
const errorHandler =
  (fn: AsyncRequestHandler) =>
    (req: Request, res: Response, next: NextFunction): void => {
      fn(req, res, next).catch((err: Error) => next(err));
    };

export default errorHandler;
