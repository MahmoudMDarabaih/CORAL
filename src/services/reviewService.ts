import Review from '../db-files/models/Review';
import { FindOptions } from 'sequelize';

// Existing function to check if a review exists by productId and userId
const checkIfUserReviewOnProductExists = async(options: { productId?: string, userId?: string })
: Promise<Review | null> => {
  const { productId, userId } = options;

  if (!productId || !userId) {
    throw new Error('Both productId and userId are required to check review existence.');
  }

  const review = await Review.findOne({
    where: { productId, userId },
  });

  return review;
};

const getReviewService = async(
  options?: FindOptions,
): Promise<Review | null> => {
  const review = await Review.findOne(options);
  return review;
};

export {
  checkIfUserReviewOnProductExists,
  getReviewService,
};
