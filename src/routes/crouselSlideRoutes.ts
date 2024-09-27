import { Router } from 'express';
import {
  createNewCarouselSlide,
  getAllCarouselSlides,
  getCarouselSlideById,
  updateCarouselSlideById,
  deleteCarouselSlideById,
} from '../controllers/carouselSlidesController';
import { methodNotAllowed } from '../controllers/suspicionController';
import {
  createCarouselSlideValidation,
  carouselSlideIdValidation,
  updateCarouselSlideValidation,
} from '../validators/carouselSlideFieldsValidation';
import validateJoiRequest from '../middlewares/validateJoiRequest';
import authMiddleware from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import uploadToMemory from '../middlewares/memoryUploadMiddleware';

const carouselSlideRouter = Router();

carouselSlideRouter.route('/')
  .get(
    authMiddleware,
    getAllCarouselSlides,
  )
  .post(
    uploadToMemory,
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ bodySchema: createCarouselSlideValidation }),
    createNewCarouselSlide,
  );

carouselSlideRouter.route('/:id')
  .get(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: carouselSlideIdValidation }),
    getCarouselSlideById,
  )
  .put(
    uploadToMemory,
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({
      bodySchema: updateCarouselSlideValidation ,
      paramsSchema: carouselSlideIdValidation }),
    updateCarouselSlideById,
  )
  .delete(
    authMiddleware,
    adminMiddleware,
    validateJoiRequest({ paramsSchema: carouselSlideIdValidation }),
    deleteCarouselSlideById,
  );

carouselSlideRouter.route('*').all(methodNotAllowed);

export default carouselSlideRouter;
