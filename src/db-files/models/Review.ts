import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';
import { recalculateProductRatingHook } from '../../hooks/addReviewHook';
import Product from './Product';

class Review extends Model {
  id!: string;
  rating!: number;
  comment!: string;
  productId!: string;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.FLOAT(2, 1),
      validate: {
        min: 1.0,
        max: 5.0,
      },
    },
    comment: {
      type: DataTypes.STRING(500),
    },
    productId: {
      type: DataTypes.STRING,
      references: {
        model: Product,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    updatedAt: false,
    timestamps: true,
    hooks: {
      afterCreate: async(review: Review) => {
        await recalculateProductRatingHook(review.productId);
      },
      afterUpdate: async(review: Review) => {
        await recalculateProductRatingHook(review.productId);
      },
      afterDestroy: async(review: Review) => {
        await recalculateProductRatingHook(review.productId);
      },
    },
  },
);

export default Review;
