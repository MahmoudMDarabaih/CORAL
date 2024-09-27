import { Transaction } from 'sequelize';
import Address from '../db-files/models/Address';

const createAddressService = async(
  state: string,
  city: string,
  street: string,
  pin: string,
  orderId: string,
  options: { transaction? : Transaction }) => {
  const address = await Address.create({
    state,
    city,
    street,
    pin,
    orderId,
  },
  options,
  );
  return address;
};

export { createAddressService };
