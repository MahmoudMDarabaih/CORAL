import { Transaction } from 'sequelize';
import Order from '../db-files/models/Order';
import sequelize from '../database';
import Address from '../db-files/models/Address';
import OrderItem from '../db-files/models/OrderItem';
import Product from '../db-files/models/Product';
import ProductImage from '../db-files/models/ProductImage';

const createOrderService = async(
  userId: string,
  orderOwner: string,
  phoneNumber: string,
  cardNumber: string,
  options: { transaction?: Transaction }) => {
  const order = await Order.create({
    userId,
    orderOwner,
    phoneNumber,
    cardNumber,
  },
  options,
  );
  return order;
};

const calculateDiscount = (brice: number, discount: number): number => {
  return brice - (discount * brice);
};

const getOrderInstanceService = async(orderId: string): Promise<Order | null> => {
  const order = await Order.findOne(
    {
      where: { id: orderId },
      attributes: [
        [sequelize.literal('totalAmount + totalDiscount'), 'subtotal'],
        'totalDiscount',
        'deliveryFees',
        ['totalAmount', 'grandtotal'],
        'phoneNumber',
        'paymentDetails',
      ],
      include: [
        {
          model: Address,
          as: 'Address',
          attributes: ['state', 'city', 'street', 'pin'],
        },
        {
          model: OrderItem,
          as: 'OrderItems',
          attributes: ['quantity', 'unitPrice', 'totalPrice'],
          include: [
            {
              model: Product,
              as: 'Product',
              attributes: ['id', 'name', 'brief'],
              include: [
                {
                  model: ProductImage,
                  attributes: ['path'],
                },
              ],
            },
          ],
        },
      ],
    },

  );
  return order;
};
export {
  createOrderService,
  calculateDiscount,
  getOrderInstanceService,
};
