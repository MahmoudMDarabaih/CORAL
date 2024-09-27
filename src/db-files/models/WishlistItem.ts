import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';
import Product from './Product';

class WishListItem extends Model {
  id!: string;
  productId!: string;
}

WishListItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    modelName: 'WishListItem',
    tableName: 'wishListItems',
    updatedAt: false,
    timestamps: true,
  },
);

export default WishListItem;
