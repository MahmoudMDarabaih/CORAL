import { NextFunction, Request, Response } from 'express';
import errorHandler from '../utils/errorHandler';
import Brand from '../db-files/models/Brand';
import APIError from '../utils/APIError';
import { checkIfBrandExists } from '../services/brandService';
import isValidFileName from '../validators/fileNameValidator';
import { uploadToFireBase, deleteFromFirebase } from '../utils/firebaseOperations';

const createNewBrand = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (!req.file){
      return next(new APIError('No image provided', 400));
    }
    if (!isValidFileName(name)){
      return next(new APIError('Invalid brand name', 400));
    }
    if (await checkIfBrandExists({ name }) !== null) {
      return next(new APIError('Brand already exist', 400));
    }
    const brand = await Brand.create({
      name,
      imagePath: `./temp${Date.now()}`, // just a temp value before we get the value from firebase
    });
    const downloadURL = await uploadToFireBase(req, 'brands');
    if (!downloadURL){
      brand.destroy();
      await brand.save();
      return next(new APIError('Brand image uploading failed', 500));
    }
    brand.imagePath = downloadURL;
    await brand.save();
    res.status(201).json({
      message: 'Brand added successfully',
      brand,
    });
  },

);

const getAllBrands = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brands = await Brand.findAll({
      attributes: ['id', 'name', 'imagePath'],
    });
    if (brands.length === 0) {
      res.status(200).send({
        message: 'No brands found',
      });
    } else {
      res.status(200).json({
        status: 'success',
        brands,
      });
    }
  },
);

const getBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    const brand = await Brand.findOne({
      where: { id: brandId },
      attributes: ['id', 'name', 'imagePath'],
    });
    if (!brand) {
      return next(new APIError('Brand doesn\'t exist', 404));
    }
    res.status(200).json({
      status: 'success',
      brand,
    });
  },
);
const updateBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const { id } = req.params;
    const image = req.file as Express.Multer.File;
    if (!name && !image){
      return next(new APIError(
        'You should update at least one thing, either the name or the image', 400,
      ));
    }
    const brand: Brand | null = await checkIfBrandExists({ id });
    if (!brand) {
      return next(new APIError('Brand doesn\'t exist', 404));
    }
    if (name) {
      if (!isValidFileName(name)){
        return next(new APIError('Invalid brand name', 400));
      }
      if (await checkIfBrandExists({ name })){
        return next(new APIError('A brand with this name already exists', 400));
      }
      brand.name = name;
      await brand.save();
    }
    if (image) {
      await deleteFromFirebase(brand.imagePath);
      const downloadURL = await uploadToFireBase(req, 'brands');
      if (!downloadURL){
        brand.destroy();
        await brand.save();
        return next(new APIError('Brand image uploading falied', 500));
      }
      brand.imagePath = downloadURL;
      await brand.save();
    }
    res.status(200).json({
      status: 'success',
      brand,
    });
  },
);

const deleteBrandById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const brandId = req.params.id;
    const brand: Brand | null = await checkIfBrandExists({ id: brandId });
    if (brand === null) {
      return next(new APIError('Brand doesn\'t exist', 400));
    }
    await deleteFromFirebase(brand.imagePath);
    await Brand.destroy({
      where: { id: brandId },
    });
    res.sendStatus(204);
  },
);
export { createNewBrand, getAllBrands, getBrandById, updateBrandById, deleteBrandById };
