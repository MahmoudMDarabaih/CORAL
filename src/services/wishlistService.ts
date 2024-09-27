import WishList from '../db-files/models/Wishlist';

// Check if a wishlist exists for a user by userId
const checkIfWishlistExists = async(userId: string): Promise<boolean> => {
  const wishlist = await WishList.findOne({ where: { userId } });
  return wishlist !== null;
};

// Fetch a wishlist by userId
const getWishlistByUserId = async(userId: string): Promise<WishList | null> => {
  const wishlist = await WishList.findOne({ where: { userId } });
  return wishlist;
};

export { checkIfWishlistExists, getWishlistByUserId };
