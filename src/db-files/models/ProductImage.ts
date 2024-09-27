import sequelize from '../../database';
import { DataTypes, Model } from 'sequelize';

class ProductImage extends Model {
  id!: string;
  path!: string;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    path: {
      type: DataTypes.STRING(500),
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'productImages',
    updatedAt: false,
    timestamps: true,
  },
);

export default ProductImage;
