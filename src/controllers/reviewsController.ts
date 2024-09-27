import { Request, Response, NextFunction } from 'express';
import Review from '../db-files/models/Review';
import Brand from '../db-files/models/Brand';
import Category from '../db-files/models/Category';
import User from '../db-files/models/User';
import Product from '../db-files/models/Product';
import Order from '../db-files/models/Order';
import OrderItem from '../db-files/models/OrderItem';
import { OrderStatus } from '../enums/orderStatus';
import errorHandler from '../utils/errorHandler';
import { checkIfUserReviewOnProductExists , getReviewService } from '../services/reviewService';
import { oneProductService } from '../services/productService';
import { checkIfOwnerUserOrAdmin } from '../services/authService';
import APIError from '../utils/APIError';

// Create a new review

const createNewReview = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { rating, comment, productId } = req.body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = (req as any);
    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // Fetch product with necessary includes
    const product = await oneProductService({
      where: { id: productId },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Brand,
          attributes: ['name'],
        },
      ],
    });

    if (!product) {
      return next(new APIError('Product not found', 404));
    }

    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          required: true,
          where: {
            userId: user.id,
            orderStatus: OrderStatus.Completed,
          },
        },
      ],
      where: {
        productId,
      },
    });

    if (orderItems.length === 0) {
      return next(new APIError(`You cannot review a product that you have
      not ordered or that is not from a completed order.`, 403));
    }

    const existingReview =
    await checkIfUserReviewOnProductExists({ productId: product.id, userId: user.id });
    if (existingReview) {
      return next(new APIError('You already added a review for this product.', 400));
    }

    // Create new review
    const review = await Review.create({
      rating,
      comment,
      productId: product.id,
      userId: user.id,
    });

    res.status(200).json({
      status: 'success',
      review,
    });
  });

// Get a review by its ID
const getReviewById = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const review = await getReviewService({
      where: {
        id,
      },
      attributes: {
        exclude: ['userId', 'productId'],
      },
      include: [
        {
          model: User,
          attributes: ['firstName'],
        },
        {
          model: Product,
          attributes: ['name'],
        },
      ],
    });

    if (!review) {
      return next(new APIError('Review not found', 404));
    }

    res.status(200).json({
      status: 'success',
      review,
    });
  },
);

const updateReviewById = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const review = await getReviewService({
      where: { id },
      attributes: {
        include: ['userId'],
      },
    }) as Review & { userId: string };

    if (!review){
      return next(new APIError('Review not found', 404));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticatedUser = (req as any).user;

    // here only the auth user can edit their review , admin has no access on that .
    if (! await checkIfOwnerUserOrAdmin(
      review.userId,
      authenticatedUser.id )){
      return next(new APIError('Unauthorized to update review.', 403));
    }

    await review.update(req.body);

    await review.save();
    res.status(200).json({
      status: 'success',
      review,
    });
  });

const deleteReviewById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const review = await getReviewService({
      where: { id },
      attributes: {
        include: ['userId'],
      },
    }) as Review & { userId: string };

    if (!review){
      return next(new APIError('Review not found', 404));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authenticatedUser = (req as any).user;

    if (! await checkIfOwnerUserOrAdmin(
      review.userId,
      authenticatedUser.id,
      authenticatedUser.role )){
      return next(new APIError('Unauthorized to delete review.', 403));
    }

    await review.destroy();
    res.sendStatus(204);
  },
);

export {
  createNewReview,
  getReviewById,
  deleteReviewById,
  updateReviewById,
};
