import { Request, Response, NextFunction } from 'express';
import Category from '../db-files/models/Category';
import errorHandler from '../utils/errorHandler';
import checkIfCategoryExists from '../services/categoryService';
import APIError from '../utils/APIError';
import isValidFileName from '../validators/fileNameValidator';
import { deleteFromFirebase, uploadToFireBase } from '../utils/firebaseOperations';

const createNewCategory = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, description } = req.body;
    if (!req.file){
      return next(new APIError('No image provided', 400));
    }
    if (!isValidFileName(name)){
      return next(new APIError('Invalid category name', 400));
    }
    // Check if the category already exists
    const categoryExists = await checkIfCategoryExists({ name });

    if (categoryExists) {
      return next(new APIError('Category name already exists', 400));
    }

    // Create the new category
    const category = await Category.create({
      name,
      description,
      imagePath: `./${Date.now()}temp`,
    }); // just a temp value until we get the Firebase url
    const downloadURL = await uploadToFireBase(req, 'categories');
    if (!downloadURL){
      await category.destroy();
      return next(new APIError('Brand image uploading failed', 500));
    }
    category.imagePath = downloadURL;
    await category.save();
    res.status(201).json({
      status: 'success',
      category,
    });
  },
);

const getAllCategories = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.findAll();
    res.status(200).json({
      status: 'success',
      categories: categories.length > 0 ? categories : 'No categories found.',
    });
  },
);

const getCategoryById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return next(new APIError('Category not found.', 404));
    }

    res.status(200).json({
      status: 'success',
      category,
    });
  },
);

const deleteCategoryById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return next(new APIError('Category not found.', 404));
    }
    await deleteFromFirebase(category.imagePath);
    await category.destroy();
    res.sendStatus(204);
  },
);

const updateCategoryById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;
    let image;
    if (req.file){
      image = req.file as Express.Multer.File;
    }
    const category = await Category.findByPk(id);
    if (!category) {
      return next(new APIError('Category not found.', 404));
    }

    // Check if the updated name already exists, if name is provided
    if (name && name !== category.name) {
      const categoryExists = await checkIfCategoryExists({ name });
      if (categoryExists) {
        return next(new APIError('Category name already exists', 400));
      }
    }
    if (image) {
      await deleteFromFirebase(category.imagePath);
      const downloadURL = await uploadToFireBase(req, 'categories');
      if (!downloadURL){
        await category.destroy();
        return next(new APIError('Category image uploading falied', 500));
      }
      category.imagePath = downloadURL;
      await category.save();
    }
    // Update category with only the provided fields
    const updatedFields = { ...(name && { name }), ...(description && { description }) };
    await category.update(updatedFields);

    await category.save();
    res.status(200).json({
      status: 'success',
      category,
    });
  },
);

export {
  createNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
