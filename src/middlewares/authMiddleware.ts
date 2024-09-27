import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../utils/jwtToken';
import User from '../db-files/models/User';
import APIError from '../utils/APIError';
import errorHandler from '../utils/errorHandler';
import type { JwtPayload } from 'jsonwebtoken';
import { Identifier } from 'sequelize';

const authMiddleware = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      [, token] = authHeader.split(' ');
    }

    // If not found in the header, try to get it from cookies
    if (!token) {
      token = req.cookies.jwt;
    }

    // If token is still not found
    if (!token) {
      return next(new APIError('Unauthorized: No token provided', 401));
    }

    const decoded: string | JwtPayload = decodeToken(token);
    const userId = decoded.sub;
    const user = await User.findByPk(userId as Identifier);

    if (!user) {
      return next(new APIError('Unauthorized: User not found', 401));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = user;
    next();
  },
);

export default authMiddleware;
