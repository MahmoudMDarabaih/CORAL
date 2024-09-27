import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database';

class CarouselSlide extends Model {
  id!: string;
  slideOrder!: number;
  imagePath!: string;
  title!: string;
  description!: string;
  categoryName?: string;
  brandName?: string;
}

CarouselSlide.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slideOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
  },
  {
    sequelize,
    modelName: 'CarouselSlide',
    tableName: 'carouselSlides',
    updatedAt: false,
    timestamps: true,
  },
);

export default CarouselSlide;
