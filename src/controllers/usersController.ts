import { Request, Response, NextFunction } from 'express';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';
import User from '../db-files/models/User';
import Review from '../db-files/models/Review';
import Product from '../db-files/models/Product';
import bcrypt from 'bcryptjs';
import {
  checkIfUserExists,
  userResponseFormatter,
} from '../services/userService';
import { checkIfOwnerUserOrAdmin } from '../services/authService';
import { uploadToFireBase, deleteFromFirebase } from '../utils/firebaseOperations';

// create user only by sign up

// Get all users
const getAllUsers = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll();
    const formattedUsers = users.map(userResponseFormatter);
    res.status(200).json({
      status: 'success',
      users: formattedUsers.length > 0 ? formattedUsers : 'No users found.',
    });
  },
);

// Get a user by ID
const getUserById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    const formattedUser = userResponseFormatter(user);
    res.status(200).json({ status: 'success', user: formattedUser });
  },
);

// Update a user by ID
const updateUserById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id ,firstName, lastName } = req.params;
    const image = req.file as Express.Multer.File;

    if (!firstName && !lastName && !image){
      return next(new APIError(
        'You should update at least one thing, either the firstName or lastName or the image', 400,
      ));
    }
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticatedUser = (req as any).user;

    if (! await checkIfOwnerUserOrAdmin(
      user.id,
      authenticatedUser.id,
      authenticatedUser.role )){
      return next(new APIError('Unauthorized to update user info.', 403));
    }

    if (image) {
      await deleteFromFirebase(user.imagePath);
      const downloadURL = await uploadToFireBase(req, 'users');
      if (!downloadURL){
        user.destroy();
        await user.save();
        return next(new APIError('User image uploading falied', 500));
      }
      user.imagePath = downloadURL;
      await user.save();
    }

    await user.update(req.body);
    await user.save();

    res.status(200).json({ status: 'success', user: userResponseFormatter(user) });
  },
);

// Delete a user by ID
const deleteUserById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    await user.destroy();
    res.status(204).json({ status: 'no content' });
  },
);

const changeUserRole = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { role } = req.body;

    // Check if the user exists
    const user = await checkIfUserExists({ id });
    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    user.role = role;
    await user.save();

    // Send the updated user response
    const formattedUser = userResponseFormatter(user);
    res.status(200).json({ status: 'success', user: formattedUser });
  },
);

const getUserReviews = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const user = await checkIfUserExists({ id });

    if (!user) {
      return next(new APIError('userN not found.', 404));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticatedUser = (req as any).user;

    if (! await checkIfOwnerUserOrAdmin(
      user.id,
      authenticatedUser.id,
      authenticatedUser.role )){
      return next(new APIError('Unauthorized to get access for user reviews.', 403));
    }

    const reviews = await Review.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Product,
          attributes: ['name' , 'rating'],
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      totalReviews: reviews.length,
      reviews: reviews.length > 0 ? reviews : 'User has no reviews yet.',
    });
  },
);

const updateUserPassword = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticatedUser = (req as any).user;
    const user = await checkIfUserExists({ id });

    if (!user){
      return next(new APIError('User not found.', 400));
    }
    if (user.id !== authenticatedUser.id){
      return next(new APIError('Unauthorized to update user info.', 403));
    }
    if (!await bcrypt.compare(currentPassword, user.password)) {
      return next(new APIError('Current password is incorrect.', 400));
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      return next(new APIError('New password cannot be the same as the current password.', 400));
    }

    // Hash the new password and update the user
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  },
);

export {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  changeUserRole,
  getUserReviews,
  updateUserPassword,
};
