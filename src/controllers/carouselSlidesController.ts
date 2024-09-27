import { Request, Response, NextFunction } from 'express';
import CarouselSlide from '../db-files/models/CarouselSlide';
import errorHandler from '../utils/errorHandler';
import APIError from '../utils/APIError';
import { checkIfCarouselSlideExists,checkIfSlideOrderExists,
  checkIfSlideTitleExists, caroselSlideResponseFormatter,
} from '../services/carouselSlideService';
import { checkIfBrandExists } from '../services/brandService';
import checkIfCategoryExists from '../services/categoryService';
import { uploadToFireBase, deleteFromFirebase } from '../utils/firebaseOperations';

const createNewCarouselSlide = errorHandler(
  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { slideOrder, title, description, categoryName, brandName } = req.body;

    // Check if the slideOrder already exists
    const slideOrderExists = await checkIfSlideOrderExists(slideOrder);
    const titleExists = await checkIfSlideTitleExists(title);
    const category = await checkIfCategoryExists({ name: categoryName });
    const brand = await checkIfBrandExists({ name: brandName });

    if (slideOrderExists) {
      return next(new APIError('Slide order already exists.', 400));
    }
    if (titleExists) {
      return next(new APIError('Title already exists.', 400));
    }
    if (categoryName && !category) {
      return next(new APIError('Category does not exist.', 400));
    }
    if (brandName && !brand) {
      return next(new APIError('Brand does not exist.', 400));
    }
    if (!req.file){
      return next(new APIError('No image provided', 400));
    }

    const downloadURL = await uploadToFireBase(req, 'carouselSlides');

    if (!downloadURL){
      return next(new APIError('Carousel Slide image uploading failed', 500));
    }

    // Create a new carousel slide
    const createNewCarouselSlide = await CarouselSlide.create({
      title,
      slideOrder,
      imagePath: downloadURL,
      description,
      categoryName,
      brandName,
      brandId: brand?.id,
      categoryId: category?.id,
    });

    const newCarouselSlide =
    caroselSlideResponseFormatter(createNewCarouselSlide);

    res.status(201).json({ status: 'success', newCarouselSlide });
  });

const getAllCarouselSlides = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const carouselSlides = await CarouselSlide.findAll();
    const formattedSlides = carouselSlides.map(caroselSlideResponseFormatter);
    res.status(200).json({
      status: 'success',
      totalSlides: carouselSlides.length,
      carouselSlides: formattedSlides.length > 0 ? formattedSlides : 'No carousel slides found.',
    });
  },
);

const getCarouselSlideById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const carouselSlide = await checkIfCarouselSlideExists({ id });

    if (!carouselSlide) {
      return next(new APIError('Carousel Slide not found.', 404));
    }
    const formattedSlide = caroselSlideResponseFormatter(carouselSlide);
    res.status(200).json({ status: 'success', carouselSlide: formattedSlide });
  },
);

const updateCarouselSlideById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { slideOrder , title , categoryName, brandName } = req.body;
    const image = req.file as Express.Multer.File;

    const carouselSlide = await checkIfCarouselSlideExists({ id });
    if (!carouselSlide) {
      return next(new APIError('Carousel Slide not found.', 404));
    }
    if (slideOrder) {
      const slideOrderExists = await checkIfSlideOrderExists(slideOrder);
      if (slideOrderExists) {
        return next(new APIError('Slide order already exists.', 400));
      }
    }
    if (title) {
      const titleExists = await checkIfSlideTitleExists(title);
      if (titleExists) {
        return next(new APIError('Title already exists.', 400));
      }
    }
    if (!title && !image){
      return next(new APIError(
        'You should update at least one thing, either the name or the image', 400,
      ));
    }
    if (categoryName) {
      const category = await checkIfCategoryExists({ name: categoryName });
      if (!category) {
        return next(new APIError('Category does not exist.', 400));
      }
    }
    if (brandName) {
      const brand = await checkIfBrandExists({ name: brandName });
      if (!brand) {
        return next(new APIError('Brand does not exist.', 400));
      }
    }

    if (image) {
      await deleteFromFirebase(carouselSlide.imagePath);
      const downloadURL = await uploadToFireBase(req, 'carouselSlides');
      if (!downloadURL){
        carouselSlide.destroy();
        await carouselSlide.save();
        return next(new APIError('Carousel Slide image uploading falied', 500));
      }
      carouselSlide.imagePath = downloadURL;
    }

    await carouselSlide.update(req.body);
    await carouselSlide.save();

    res.status(200).json({ status: 'success', carouselSlide });
  });

const deleteCarouselSlideById = errorHandler(
  async(req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const carouselSlide = await checkIfCarouselSlideExists({ id });

    if (!carouselSlide) {
      return next(new APIError('Carousel Slide not found.', 404));
    }

    await carouselSlide.destroy();
    res.status(204 ).json({ status: 'no content' });
  },
);

export {
  createNewCarouselSlide,
  getAllCarouselSlides,
  getCarouselSlideById,
  updateCarouselSlideById,
  deleteCarouselSlideById,
};
