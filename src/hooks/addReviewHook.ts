import Review from '../db-files/models/Review';
// import Product from '../db-files/models/Product';
import { oneProductService } from '../services/productService';
import APIError from '../utils/APIError';

const recalculateProductRatingHook = async(productId: string): Promise<void> => {
  const product = await oneProductService({
    where: {
      id: productId,
    },
  });
  if (!product) {
    throw new APIError('Something wrong happened', 500);
  }
  // Get all reviews for the product
  const reviews = await Review.findAll({
    where: { productId: product.id },
  });
  // if all reviews on a product got deleted, return to default value: 5
  let averageRating;
  if (reviews.length === 0){
    averageRating = 5;
  } else {
    // Calculate average rating
    const ratings = reviews.map((r) => r.rating);
    averageRating = ratings.reduce((acc, current) => acc + current, 0) / ratings.length;
  }

  // Update product rating
  product.rating = averageRating;
  await product.save();
};

export { recalculateProductRatingHook };
