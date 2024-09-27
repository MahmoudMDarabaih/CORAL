import { DataTypes, Model } from 'sequelize';
import UserRole from '../../enums/userRoles';
import sequelize from '../../database';

class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  mobileNumber?: string;
  password!: string;
  imagePath!: string;
  role!: UserRole;
  dateOfBirth?: Date;
  balance!: number;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: [/^\+\d{1,3}\d{7,14}$/],
          msg: `Mobile number must start with 
          a + followed by a country code (1-3 digits) and then 7-14 digits for the phone number`,
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: 'user',
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT(10, 2),
      defaultValue: 20000,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    updatedAt: false,
    timestamps: true,
  },
);

export default User;
