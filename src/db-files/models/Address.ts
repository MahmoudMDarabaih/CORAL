import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database';

class Address extends Model {
  id!: string;
  city!: string;
  state!: string;
  street!: string;
  pin!: number;
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    updatedAt: false,
    timestamps: true,
  },
);

export default Address;
