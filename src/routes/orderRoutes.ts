import express, { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import {
  createOrderValidation,
  orderIdValidation,
} from '../validators/orderFieldsValidation';
import { createOrder, getAllOrders, getOrderData } from '../controllers/ordersController';
import { methodNotAllowed } from '../controllers/suspicionController';

const orderRouter: Router = express.Router();

orderRouter.route('/')
  .post(
    authMiddleware,
    validateJoiRequest({ bodySchema: createOrderValidation }),
    createOrder,
  ).get(
    authMiddleware,
    getAllOrders,
  );
orderRouter.route('/:id')
  .get(
    authMiddleware,
    validateJoiRequest({ paramsSchema: orderIdValidation }),
    getOrderData,
  );

orderRouter.route('*').all(methodNotAllowed);

export default orderRouter;
