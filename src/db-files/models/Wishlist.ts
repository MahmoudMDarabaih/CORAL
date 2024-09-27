import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';
import User from '../models/User';

class WishList extends Model {
  id!: string;
  userId!: string;
}

WishList.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'WishList',
    tableName: 'wishLists',
    updatedAt: false,
    timestamps: true,
  },
);

export default WishList;
