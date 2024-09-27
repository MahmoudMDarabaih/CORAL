import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';

class Category extends Model {
  id!: string;
  name!: string;
  description!: string;
  imagePath!: string;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    updatedAt: false,
    timestamps: true,
  },
);

export default Category;
