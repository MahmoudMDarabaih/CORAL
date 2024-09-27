import { Transaction } from 'sequelize';
import OrderItem from '../db-files/models/OrderItem';;

const createOrderItemService = async(
  orderId: string,
  productId: string,
  quantity: number,
  unitPrice: number,
  options: { transaction?: Transaction }): Promise<OrderItem | null> => {
  const totalPrice = (quantity * unitPrice);
  const orderItem = await OrderItem.create({
    productId,
    orderId,
    quantity,
    unitPrice,
    totalPrice,
  },
  options,
  );
  return orderItem;
};

export { createOrderItemService };
