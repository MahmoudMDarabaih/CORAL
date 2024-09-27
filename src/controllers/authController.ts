import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';
import { generateToken } from '../utils/jwtToken';
import bcrypt from 'bcryptjs';
import { checkIfEmailExists,
  checkIfUserExists ,
  userResponseFormatter } from '../services/userService';
import User from '../db-files/models/User';

const signup = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } =
      req.body;
    if (await checkIfEmailExists(email)) {
      return next(new APIError('Email already in use', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User registered successfully',
    });
  },
);

const login = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await checkIfUserExists({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new APIError('Invalid email or password', 401));
    }

    const token = generateToken(user);

    res.cookie('jwt', token, {
      // Ensures the cookie is only sent via HTTP(S) and not accessible via JavaScript
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiration
    });

    res.status(200).json({
      message: 'Logged in successfully',
      token ,
      user: userResponseFormatter(user) });
  },
);

// Logout handler
const logout = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('jwt', { httpOnly: true });
    res.status(200).json({ message: 'Successfully logged out' });
  },
);

export { signup, login, logout };
