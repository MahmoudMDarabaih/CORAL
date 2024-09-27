import { Router } from 'express';
import {
  toggleProductToUserWishlist,
  getUserWishList,
  deleteUserWishList,
} from '../controllers/wishListsController';
import { methodNotAllowed } from '../controllers/suspicionController';

import validateJoiRequest from '../middlewares/validateJoiRequest';
import {  wishListProductIdValidation } from '../validators/wishlistFieldsValidation';

import authMiddleware from '../middlewares/authMiddleware';

const wishListRouter = Router();

wishListRouter.route('/')
  .post(
    authMiddleware,
    validateJoiRequest({ bodySchema: wishListProductIdValidation }),
    toggleProductToUserWishlist,
  )
  .get(
    authMiddleware,
    getUserWishList,
  )
  .delete(
    authMiddleware,
    deleteUserWishList,
  );

wishListRouter.route('*').all(methodNotAllowed);

export default wishListRouter;
