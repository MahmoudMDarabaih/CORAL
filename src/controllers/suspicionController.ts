import { Request, Response } from 'express';

const tooManyRequests = (req: Request, res: Response): void => {
  res.status(429).json({
    status: 'fail',
    message: 'Easy there bud! we are limited on resources :>',
  });
};

const endpointNotImplemented = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'fail',
    message: 'Endpoint not implemented.',
  });
};

const methodNotAllowed = (req: Request, res: Response): void => {
  res.status(405).json({
    status: 'fail',
    message: `${req.method} is not implemented for this endpoint`,
  });
};

export { tooManyRequests, methodNotAllowed, endpointNotImplemented };
