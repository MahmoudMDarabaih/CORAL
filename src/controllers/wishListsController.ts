import { NextFunction, Request, Response } from 'express';
import Product from '../db-files/models/Product';
import WishList from '../db-files/models/Wishlist';
import WishListItem from '../db-files/models/WishlistItem';
import errorHandler from '../utils/errorHandler';
import { oneProductService } from '../services/productService';
import {  getWishlistByUserId } from '../services/wishlistService';

import APIError from '../utils/APIError';

const toggleProductToUserWishlist = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = (req as any);
    const { productId } = req.body;

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    const product = await oneProductService({ where: { id: productId } });

    if (!product) {
      return next(new APIError('Product not found', 404));
    }

    let wishlist: WishList | null = await getWishlistByUserId(user.id);
    if (!wishlist) {
      wishlist = await WishList.create({ userId: user.id });
    }

    const isInWishlist = await WishListItem.findOne({
      where: {
        productId: product.id,
        wishListId: wishlist.id,
      },
    });

    if (isInWishlist) {
      await WishListItem.destroy({
        where: {
          productId: product.id,
          wishListId: wishlist.id,
        },
      });
      res.status(200).json({ status: 'success', message: 'Product removed from wishlist' });
    } else {
      await WishListItem.create({
        productId: product.id,
        wishListId: wishlist.id,
      });
      res.status(200).json({ status: 'success', message: 'Product added to wishlist' });
    }
  },
);

const getUserWishList = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = (req as any);

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    const wishlist = await getWishlistByUserId(user.id);

    if (!wishlist) {
      return next(new APIError('there are no items in your wishlist yet', 404));
    }

    const wishListItems = await WishListItem.findAll({
      where: { wishListId: wishlist.id },
      attributes: ['productId'],
    });

    if (!wishListItems.length) {
      return next(new APIError('there are no items in your wishlist yet', 404));
    }

    const productIds = wishListItems.map((item) => item.productId);

    const products = await Product.findAll({
      where: {
        id: productIds,
      },
      attributes: {
        exclude: ['brandId', 'categoryId'],
      },
    });

    res.status(200).json({ status: 'success', totalWishListItems: products.length , products });
  },

);

const deleteUserWishList = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { user } = (req as any);

    if (!user) {
      return next(new APIError('User not found.', 404));
    }

    // Fetch the wishlist for the user
    const wishlist = await getWishlistByUserId(user.id);

    if (!wishlist) {
      return next(new APIError('there are no items in your wishlist yet', 404));
    }

    // Delete all wishlist items
    await WishListItem.destroy({
      where: { wishListId: wishlist.id },
    });

    // Delete the wishlist itself
    await WishList.destroy({
      where: { id: wishlist.id },
    });

    res.status(200).json({ status: 'success', message: 'Wishlist and all items removed' });
  },
);

export { toggleProductToUserWishlist , getUserWishList , deleteUserWishList };
