import { FindOptions, Includeable, Transaction , Op } from 'sequelize';
import Product from '../db-files/models/Product';
import { productQueryInterface } from '../utils/interfaces/productQueryOptionsInterface';
import Brand from '../db-files/models/Brand';
import Category from '../db-files/models/Category';
import ProductImage from '../db-files/models/ProductImage';

const oneProductService = async(
  options?: FindOptions,
): Promise<Product | null> => {
  const product = await Product.findOne(options);
  return product;
};

interface FilterOptions {
  rating?: { [Op.gt]?: number; [Op.gte]?: number };
  price?: { [Op.lt]?: number };
  discountRate?: { [Op.gte]?: number };
  createdAt?: { [Op.between]?: Date[] };
  name?: { [Op.iLike]?: string };
}

const productsService = async(
  options: FindOptions = {},
  query?: productQueryInterface,
  filterOptions?: FilterOptions,
): Promise<Product[]> => {
  const include: Includeable[] = [];
  const brandInclude: Includeable = {
    model: Brand,
    attributes: ['name', 'id'],
  };
  const categoryInclude: Includeable = {
    model: Category,
    attributes: ['name', 'id'],
  };
  const productImagesInclude: Includeable = {
    model: ProductImage,
    attributes: ['path'],
  };

  if (query?.category) {
    categoryInclude.where = {
      name: query.category,
    };
  }
  if (query?.brand) {
    brandInclude.where = {
      name: query.brand,
    };
  }
  include.push(categoryInclude, brandInclude, productImagesInclude);

  include.push(categoryInclude, brandInclude);
  options.include = include;

  if (filterOptions) {
    options.where = {
      ...filterOptions,
    };
  }

  const products = await Product.findAll(options);
  return products;
};

const checkProductStock = async(
  checkOptions: { product?: Product, id?: string },
  quantity: number,
) => {
  const { product, id } = checkOptions;
  let stock = 0;
  if (product) {
    ({ stock } = product);
  }
  if (id){
    const product = await oneProductService({
      where: {
        id,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stock = product?.stock as any;
  }

  if (quantity > stock) {
    return false;
  }
  return true;
};

const getCategoriesWithProducts = async(productIds: string[]): Promise<Category[]> => {
  return await Category.findAll({
    include: [{
      model: Product,
      where: {
        id: productIds,
      },
      attributes: [], // Exclude product fields to avoid redundancy
    }],
  });
};

const updateProductService = async(
  product: Product,
  options: { [key: string]: string | number },
  transaction: Transaction) => {
  return await product.update(options, { transaction });
};

const productResponseFormatter = (
  product: Product,
  category: string,
  brand: string,
): object => {
  const responseObject: { [key: string]: string | number | boolean | undefined } = {};
  responseObject.id = product.id;
  responseObject.name = product.name;
  responseObject.brief = product.brief;
  responseObject.description = product.description;
  responseObject.price = product.price;
  responseObject.stock = product.stock;
  responseObject.discountRate = product.discountRate;
  responseObject.rating = product.rating;
  responseObject.category = category;
  responseObject.brand = brand;
  responseObject.newPrice =
    product.discountRate < 1 ? product.price * (1 - product.discountRate) : undefined;
  responseObject.isLimitedEdition = product.isLimitedEdition;
  return responseObject;
};

export {
  oneProductService,
  productsService,
  productResponseFormatter,
  checkProductStock,
  updateProductService,
  getCategoriesWithProducts };
