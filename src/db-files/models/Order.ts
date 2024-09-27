import { Model, DataTypes } from 'sequelize';
import sequelize from '../../database';
import { OrderStatus } from '../../enums/orderStatus';

class Order extends Model {
  id!: string;
  orderOwner!: string;
  phoneNumber!: string;
  cardNumber!: string;
  totalAmount!: number;
  totalDiscount!: number;
  deliveryFees!: number;
  paymentDetails!: string;
  orderStatus!: OrderStatus;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderOwner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    totalDiscount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    deliveryFees: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    paymentDetails: {
      type: DataTypes.STRING,
      defaultValue: 'Credit Card',
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.Processing,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    updatedAt: false,
    timestamps: true,
  },
);

export default Order;
