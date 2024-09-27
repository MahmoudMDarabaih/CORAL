import ProductImage from '../db-files/models/ProductImage';
import { deleteFromFirebase } from '../utils/firebaseOperations';

const countProductImages = async(id: string): Promise<number> => {
  const imagesCount = await ProductImage.count({ where: { productId: id } });
  return imagesCount;
};

const productImageService = async(
  id: string,
  productId: string,
): Promise<ProductImage | null> => {
  const productImage = await ProductImage.findOne({ where: {
    id,
    productId,
  },
  });
  return productImage;
};

const deleteProductImagesService = async(id: string): Promise<void> => {
  const productImages = await ProductImage.findAll({ where: { productId: id } });
  const deleteImagesPromiseArr: Promise<void>[] = [];
  for (let i = 0; i < productImages.length; i++){
    deleteImagesPromiseArr.push(deleteFromFirebase(productImages[i].path));
  }
  await Promise.all(deleteImagesPromiseArr);
};

const createProductImageService = async(
  productId: string,
): Promise<ProductImage | null> => {
  const productImage:ProductImage | null = await ProductImage.create({
    path: `./${Date.now()}temp`, // just a temp path until we retrieve the firebase one.
    productId,
  });
  return productImage;
};

export { countProductImages,
  createProductImageService,
  deleteProductImagesService,
  productImageService };
