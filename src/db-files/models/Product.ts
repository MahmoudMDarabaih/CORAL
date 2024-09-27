import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';
import Category from './Category';

class Product extends Model {
  id!: string;
  name!: string;
  brief!: string;
  description!: string;
  price!: number;
  stock!: number;
  discountRate!:number;
  rating!: number;
  isLimitedEdition!: boolean;
  categoryId!: string;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    brief: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT(7, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    discountRate: {
      type: DataTypes.FLOAT(3, 2),
      defaultValue: 1,
      validate: {
        min: 0.01,
        max: 1.0,
      },
    },
    categoryId: {
      type: DataTypes.STRING,
      references: {
        model: Category,
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.FLOAT(2, 1),
      allowNull: false,
      defaultValue: 5.0,
    },
    isLimitedEdition: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.stock < 20;
      },
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    updatedAt: false,
    timestamps: true,
  },
);

export default Product;
