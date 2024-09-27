import { Op } from 'sequelize';
import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import { checkIfBrandExists } from '../services/brandService';
import APIError from '../utils/APIError';
import Product from '../db-files/models/Product';
import User from '../db-files/models/User';
import Review from '../db-files/models/Review';
import checkIfCategoryExists from '../services/categoryService';
import Category from '../db-files/models/Category';
import Brand from '../db-files/models/Brand';
import {
  productsService,
  oneProductService,
  getCategoriesWithProducts,
  productResponseFormatter } from '../services/productService';
import {
  countProductImages,
  createProductImageService,
  deleteProductImagesService,
  productImageService } from '../services/productImageService';
import { deleteFromFirebase, uploadToFireBase } from '../utils/firebaseOperations';
import ProductImage from '../db-files/models/ProductImage';

const createProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name, brief, description, price, brandName,
      categoryName, discountRate , stock } = req.body;
    const category = await checkIfCategoryExists({ name: categoryName });
    const brand = await checkIfBrandExists({ name: brandName });

    if (!category) {
      return next(new APIError('Category does not exist.', 400));
    }
    if (!brand) {
      return next(new APIError('Brand does not exist.', 400));
    }
    const newProduct = await Product.create({
      name,
      brief,
      description,
      price,
      discountRate,
      stock,
      brandId: brand.id,
      categoryId: category.id,
    });
    const product = productResponseFormatter(newProduct, categoryName, brandName);
    res.status(201).json({
      status: 'success',
      product,
    });
  },
);

const getProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await oneProductService({
      where: {
        id,
      },
      attributes: {
        exclude: ['brandId', 'categoryId'],
      },
      include: [
        {
          model: Category,
          attributes: ['name', 'id'],
        },
        {
          model: Brand,
          attributes: ['name', 'id'],
        },
        {
          model: ProductImage,
          attributes: ['path'],
        },
      ],
    });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    // Count the total number of reviews for the product
    const totalReviews = await Review.count({
      where: { productId: product.id },
    });

    res.status(200).json({
      status: 'success', totalReviews, product,
    });
  },
);

const getAllProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const products = await productsService(
      {
        attributes: {
          exclude: ['brandId', 'categoryId'],
        },
      },
      req.query,
    );
    res.status(200).json({
      status: 'success',
      numberOfRecords: products.length,
      products: products.length > 0 ? products : 'No products found.',
    });
  },
);

const deleteProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await oneProductService({ where: { id } });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    await deleteProductImagesService(id); // to delete product's images from Firebase
    await product.destroy();
    res.sendStatus(204);
  },
);

const updateProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { categoryName, brandName } = req.body;
    const brand = await checkIfBrandExists({ name: brandName });
    if (!brand){
      return next(new APIError('Brand not found', 404));
    }
    const category = await checkIfCategoryExists({ name: categoryName });
    if (!category){
      return next(new APIError('Category not found', 404));
    }
    const product = await oneProductService({ where: { id } });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    product.update({ ...req.body, brandId: brand.id, categoryId: category.id });
    await product.save();
    res.status(200).json({
      status: 'success',
      product,
    });
  },
);

const addImageToProduct = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!req.file){
      return next(new APIError('No image provided', 400));
    }
    const product = await oneProductService({ where: { id } });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    const imagesCount = await countProductImages(id);
    if (imagesCount >= 5){
      return next(new APIError('A product should not have more than 5 images', 400));
    }
    const productImage = await createProductImageService(id);
    if (!productImage){
      return next(new APIError('Something wrong happened creating a new image record', 500));
    }
    const downloadURL = await uploadToFireBase(req, 'products');
    if (!downloadURL){
      return next(new APIError('Product image uploading failed', 500));
    }
    productImage.path = downloadURL;
    await productImage.save();
    res.status(201).json({
      status: 'success',
      productImage,
    });
  },
);

const deleteProductImage = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id, productImageId } = req.params;
    const product = await oneProductService({ where: { id } });
    if (!product){
      return next(new APIError('Product not found', 404));
    }
    const productImage = await productImageService(productImageId, id);
    if (!productImage){
      return next(new APIError('Product image with that ID does not exist', 404));
    }
    await deleteFromFirebase(productImage.path);
    await productImage.destroy();
    res.sendStatus(204);
  },
);

const getNewArrivals = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const filterOptions = {
      createdAt: {
        [Op.between]: [threeMonthsAgo, now],
      },
    };

    const newArrivals = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      totalProducts: newArrivals.length,
      products: newArrivals.length > 0 ? newArrivals : 'No new arrivals found.',
    });
  },
);
// Fetch Handpicked Collections
const getHandpickedCollections = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const filterOptions = {
      rating: { [Op.gt]: 4.5 },
      price: { [Op.lt]: 100 },
    };

    const filteredProducts = await productsService({}, undefined, filterOptions);;

    const productIds = filteredProducts.map((product) => product.id);

    const categories = await getCategoriesWithProducts(productIds);

    const categoriesWithProducts = categories.map((category) => ({
      ...category.toJSON(),
      products: filteredProducts.filter((product) => product.categoryId === category.id),
    }));

    res.status(200).json({
      status: 'success',
      totalCategories: categoriesWithProducts.length,
      categories: categoriesWithProducts.length > 0
        ? categoriesWithProducts : 'No handpicked collections found.',
    });
  },
);

const getLimitedEditionProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const allProducts = await productsService({}, undefined);
    const limitedEditionProducts = allProducts.filter((product) => product.isLimitedEdition);

    res.status(200).json({
      status: 'success',
      totalProducts: limitedEditionProducts.length,
      products: limitedEditionProducts.length > 0
        ? limitedEditionProducts
        : 'No limited edition products found.',
    });
  },
);

const getDiscountedProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const filterOptions = {
      discountRate: { [Op.gte]: 0.15 },
    };

    const discountedProducts = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      totalProducts: discountedProducts.length,
      products: discountedProducts.length > 0 ?
        discountedProducts : 'No products found with 15% discount or more',
    });
  },
);

const getPopularProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const filterOptions = {
      rating: { [Op.gte]: 4.5 },
    };

    const popularProducts = await productsService({}, undefined, filterOptions);

    res.status(200).json({
      status: 'success',
      totalProducts: popularProducts.length,
      products: popularProducts.length > 0 ? popularProducts : 'No popular products found.',
    });
  },
);

const getSearchedProducts = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    const searchByName = query.name as string;

    if (!searchByName) {
      return next(new APIError('Search name is required.', 400));
    }

    const filterOptions = {
      name: {
        [Op.like]: `%${searchByName}%`,
      },
    };

    const products = await productsService(
      {
        where: filterOptions,
      },
    );

    res.status(200).json({
      status: 'success',
      totalProducts: products.length,
      products: products.length > 0 ? products : 'No products found matching your search.',
    });
  },
);

const getProductReviews = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const product = await oneProductService({
      where: { id },
    });

    if (!product) {
      return next(new APIError('Product not found', 404));
    }

    const reviews = await Review.findAll({
      where: { productId: product.id },
      include: [
        {
          model: User,
          attributes: ['firstName'],
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      totalReviews: reviews.length,
      reviews: reviews.length > 0 ? reviews : 'Product has no reviews yet.',
    });
  },
);

export {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  addImageToProduct,
  deleteProductImage,
  getNewArrivals,
  getHandpickedCollections,
  getLimitedEditionProducts,
  getDiscountedProducts,
  getPopularProducts,
  getSearchedProducts,
  getProductReviews,
};
