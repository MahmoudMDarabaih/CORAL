import Address from './models/Address';
import Brand from './models/Brand';
import CarouselSlide from './models/CarouselSlide';
import Category from './models/Category';
import Order from './models/Order';
import ProductImage from './models/ProductImage';
import Product from './models/Product';
import User from './models/User';
import WishList from './models/Wishlist';
import Review from './models/Review';
import OrderItem from './models/OrderItem';
import WishListItem from './models/WishlistItem';

const associateModels = (): void => {
  // --------------- User Associations --------------- :

  // A user has one order
  User.hasOne(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Order.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A user has one wishlist which has many products , and wishlist belongs to one user.
  User.hasOne(WishList, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  WishList.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A user has many reviews but a review belongs to one user
  User.hasMany(Review, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Review.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // --------------- Product Associations --------------- :

  // A product belongs to one brand while a brand has many products
  Brand.hasMany(Product, {
    foreignKey: 'brandId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  Product.belongsTo(Brand, {
    foreignKey: 'brandId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });

  // A product belongs to one category while a category has many products
  Category.hasMany(Product, {
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });

  // A product has many images in productImages table and each image belongs to one product
  Product.hasMany(ProductImage, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ProductImage.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // An order has many products through order items
  Order.belongsToMany(Product, {
    through: OrderItem,
    foreignKey: 'orderId',
    onDelete: 'CASCADE', // Orders will be deleted if an Order is deleted
    onUpdate: 'CASCADE',
  });
  Product.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'productId',
    onDelete: 'RESTRICT', // The logic of it to be implemented in the controllers
    onUpdate: 'CASCADE',
  });
  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  // A product has many reviews but a review belongs to one product
  Product.hasMany(Review, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Review.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A Wishlist has many products and one product belongs to many wishlists
  WishList.belongsToMany(Product, {
    through: 'wishListItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Product.belongsToMany(WishList, {
    through: 'wishListItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // --------------- Address Associations --------------- :

  // An address belongs to one order and an order has one address
  Order.hasOne(Address, { // has One creates the foreign key on the target model "Address"
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Address.belongsTo(Order, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // --------------- Carousel Slides Associations --------------- :

  // A category has one carousel slide and a carousel slide belongs to one category
  Category.hasOne(CarouselSlide, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  CarouselSlide.belongsTo(Category, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A Brand has one carousel slide and a carousel slide belongs to one Brand
  Brand.hasOne(CarouselSlide, {
    foreignKey: 'brandId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  CarouselSlide.belongsTo(Brand, {
    foreignKey: 'brandId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};
// order items and product
// Add these new associations
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// --------------- Orders & OrderItems Associations --------------- :

// An order has many order items
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// --------------- WishLists & WishListItems Associations --------------- :
WishList.belongsToMany(Product, {
  through: WishListItem,
  foreignKey: 'wishListId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Product.belongsToMany(WishList, {
  through: WishListItem,
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default associateModels;
